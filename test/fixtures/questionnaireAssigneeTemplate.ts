import { pgModels, pgRepositories } from '@/dbs/typeorm/index.js';
import setFixtureValues from './setFixtureValues.js';
import slug from './slug.js';

type RequiredFields = 'questionnaireTemplateId';
type Options =
  & Partial<Omit<pgModels.QuestionnaireAssigneeTemplate, RequiredFields >>
  & Required<Pick<pgModels.QuestionnaireAssigneeTemplate, RequiredFields>>

const createQuestionnaireAssigneeTemplate = async (opts: Options): Promise<pgModels.QuestionnaireAssigneeTemplate> => {
  const fieldTemplateAssignee = await setFixtureValues(
    new pgModels.QuestionnaireAssigneeTemplate(),
    opts,
    {
      slug: () => slug(),
    },
  );

  return await pgRepositories.questionnaireAssigneeTemplate.save(fieldTemplateAssignee);
};

export default createQuestionnaireAssigneeTemplate;
