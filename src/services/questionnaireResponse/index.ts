import {
  pgModels,
  pgRepositories,
} from '@/dbs/typeorm/index.js';
import {
  ForbiddenError,
  NotFoundError,
} from '@/errors/index.js';
import * as ApiModels from '@/typings/api-models.js';
import { PaginatedFunctionResponse } from '@/typings/utility.js';
import BaseService, { TypedListenerFunction } from '@/services/BaseService/index.js';
import { logWithCid } from '@/utils/logger/index.js';
import noodleApi from '@/interfaces/noodleApi/index.js';
import assignPropsToModel from '@/utils/assignPropsToModel.js';

enum EVENTS {
  QUESTIONNAIRE_RESPONSES_UPDATED = 'case-responses-updated',
}

export type EVENT_PARAMS = {
  [EVENTS.QUESTIONNAIRE_RESPONSES_UPDATED]: {
    questionnaireId: string;
  };
};

class QuestionnaireResponseService extends BaseService<EVENT_PARAMS> {
  EVENTS = EVENTS;

  private async isOnCreatorTeam({
    questionnaire,
    requester,
  }: {
    questionnaire: Pick<pgModels.Questionnaire, 'creatorId'>;
    requester: { id: string };
  }): Promise<boolean> {
    const response = await noodleApi.hasCreatorPermissions({
      creatorId: questionnaire.creatorId,
      personId: requester.id,
      scope: 'is-member',
    });

    return response.hasPermission;
  }

  async hasPermissions({
    questionnaire,
    requester,
  }: {
    questionnaire: Pick<pgModels.Questionnaire, 'id' | 'creatorId'>;
    requester: { id: string };
  }): Promise<boolean> {
    if (await this.isOnCreatorTeam({ questionnaire, requester })) {
      return true;
    }

    const assignees = await pgRepositories.questionnaireAssignee.findBy({
      questionnaireId: questionnaire.id,
    });

    return assignees.map((a) => a.personId).includes(requester.id);
  }

  async getQuestionnaireResponses({
    questionnaireId,
    requester,
  }: {
    questionnaireId: string;
    requester: { id: string };
  }): Promise<PaginatedFunctionResponse<pgModels.QuestionnaireResponse & {
    fieldTemplate: pgModels.FieldTemplate & {
      questionnaire: pgModels.QuestionnaireTemplate;
      assignees: Array<ApiModels.Assignee>;
    };
  }
  >> {
    const questionnaire = await pgRepositories.questionnaire.findOneBy({ id: questionnaireId });
    if (!questionnaire) {
      throw new NotFoundError();
    }

    if (!await this.hasPermissions({ questionnaire, requester })) {
      throw new ForbiddenError();
    }

    // @todo use zod to check value against schema
    return {
      items: [],
      numItems: 0,
    };
  }

  async updateQuestionnaireResponses({
    responses,
    questionnaireId,
    requester,
  }: {
    responses: Array<{
      fieldTemplateId: string;
      key: string;
      value: unknown; // depends on field type
    }>;
    questionnaireId: string;
    requester: { id: string };
  }): Promise<Array<pgModels.QuestionnaireResponse & {
    fieldTemplate: pgModels.FieldTemplate & {
      questionnaire: pgModels.QuestionnaireTemplate;
      assignees: Array<ApiModels.Assignee>;
    };
  }>> {
    const questionnaire = await pgRepositories.questionnaire.findOneBy({ id: questionnaireId });
    if (!questionnaire) {
      throw new NotFoundError();
    }

    if (!await this.hasPermissions({ questionnaire, requester })) {
      throw new ForbiddenError();
    }

    const log = logWithCid();
    log.info({ questionnaireId }, 'example to show how to log');

    // @todo - validate response type. For now still save, but log error in sentry
    const toSave = responses.map((response) => assignPropsToModel(new pgModels.QuestionnaireResponse(), {
      fieldTemplateId: response.fieldTemplateId,
      questionnaireId: questionnaire.id,
      submittedById: requester.id,
      value: response.value,
    }));

    await pgRepositories.questionnaireResponse.save(toSave);

    this.emit(this.EVENTS.QUESTIONNAIRE_RESPONSES_UPDATED, {
      questionnaireId,
    });

    // @todo use zod to check value against schema
    return [];
  }
}

export type InvoiceListener<EMITTED_EVENT_PARAMS extends Record<string, unknown>, EV extends keyof EMITTED_EVENT_PARAMS> = TypedListenerFunction<InstanceType<typeof QuestionnaireResponseService>['execute'], EMITTED_EVENT_PARAMS, EV>;

const quetionnaireResponseService = new QuestionnaireResponseService();

export default quetionnaireResponseService;
