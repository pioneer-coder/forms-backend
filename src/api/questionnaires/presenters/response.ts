import _ from 'lodash';
import { pgModels } from '@/dbs/typeorm/index.js';
import * as ApiModels from '@/typings/api-models.js';

type Input = pgModels.QuestionnaireResponse & {
  fieldTemplate: pgModels.FieldTemplate & {
    questionnaire: pgModels.QuestionnaireTemplate;
    assignees: Array<ApiModels.Assignee>;
  };
};
type Output = ApiModels.QuestionnaireResponse

const presentResponse = (responsee: Input): Output => ({
  fieldTemplate: {
    ..._.pick(
      responsee.fieldTemplate,
      'descriptionHtml',
      'id',
      'isRequired',
      'key',
      'label',
      'options',
      'rank',
      'sectionTemplateId',
      'type',
      'validation',
    ),
    assignees: responsee.fieldTemplate.assignees,
    questionnaireId: responsee.fieldTemplate.questionnaireTemplateId,
  },
  id: responsee.id,
  value: responsee.value,
});

export default presentResponse;
