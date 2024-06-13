import { FindOneWithRelations, pgModels, pgRepositories } from '@/dbs/typeorm/index.js';
import NotFoundError from '@/errors/NotFoundError.js';
import { ServerError } from '@/errors/index.js';
import sentry from '@/interfaces/sentry/index.js';
import { getCorrelationId } from '@/utils/correlationId/index.js';
import { logWithCid } from '@/utils/logger/index.js';
import Bluebird from 'bluebird';
import { IsNull } from 'typeorm';

class QuestionnaireTemplateService {
  private async addlistItemTemplates<LT extends { id: string }>(listTemplate: LT, depth: number = 1): Promise<LT & {
    listItemTemplates?: pgModels.FieldTemplate[];
  }> {
    if (depth === 4) {
      const log = logWithCid();
      const cid = getCorrelationId();
      const error = new ServerError('Reached depth limit getting list items for template');
      log.error(error, 'Reached depth limit getting list items for template');

      sentry.captureException(error, { correlationId: cid });
      return listTemplate;
    }

    const listItems = await pgRepositories.fieldTemplate.findBy({
      listFieldTemplateId: listTemplate.id,
    });

    const listItemsDeep = await Bluebird.map(
      listItems,
      (listItem) => this.addlistItemTemplates(listItem, depth + 1),
      { concurrency: 3 },
    );

    return { ...listTemplate, listItemTemplates: listItemsDeep };
  }

  async getQuestionnaireTemplate({ questionnaireTemplateId }: {
    questionnaireTemplateId: string;
  }): Promise<pgModels.QuestionnaireTemplate & {
    sectionTemplates: Array<pgModels.SectionTemplate & {
      fieldTemplates: Array<pgModels.FieldTemplate>;
    }>
  }> {
    const questionnaireTemplate = await pgRepositories.questionnaireTemplate.findOne({
      relations: {
        sectionTemplates: {
          fieldTemplates: true,
        },
      },
      where: {
        id: questionnaireTemplateId,
        sectionTemplates: {
          fieldTemplates: { listFieldTemplateId: IsNull() },
        },
      },
    }) as FindOneWithRelations<
      pgModels.QuestionnaireTemplate & {
        sectionTemplates: Array<pgModels.SectionTemplate & {
          fieldTemplates: Array<pgModels.FieldTemplate>;
        }>;
      },
      'sectionTemplates'
    >;

    if (!questionnaireTemplate) {
      throw new NotFoundError();
    }

    const sectionsWithListItems = await Bluebird.mapSeries(
      questionnaireTemplate.sectionTemplates,
      async (sectionTemplate) => {
        const fieldsWithListItems = await Bluebird.mapSeries(
          sectionTemplate.fieldTemplates,
          async (fieldTemplate) => this.addlistItemTemplates(fieldTemplate),
        );
        return { ...sectionTemplate, fieldTemplates: fieldsWithListItems };
      },
    );

    return { ...questionnaireTemplate, sectionTemplates: sectionsWithListItems };
  }
}

const questionnaireTemplateService = new QuestionnaireTemplateService();
export default questionnaireTemplateService;
