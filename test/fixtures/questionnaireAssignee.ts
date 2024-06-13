import { nanoid } from 'nanoid';
import { pgModels, pgRepositories } from '@/dbs/typeorm/index.js';
import setFixtureValues from './setFixtureValues.js';

type RequiredFields = 'questionnaireId' | 'questionnaireAssigneeTemplateId';
type Options =
  & Partial<Omit<pgModels.QuestionnaireAssignee, RequiredFields >>
  & Required<Pick<pgModels.QuestionnaireAssignee, RequiredFields>>

const createQuestionnaireAssignee = async (opts: Options): Promise<pgModels.QuestionnaireAssignee> => {
  const fieldAssignee = await setFixtureValues(
    new pgModels.QuestionnaireAssignee(),
    opts,
    {
      personId: () => nanoid(),
    },
  );

  return await pgRepositories.questionnaireAssignee.save(fieldAssignee);
};

export default createQuestionnaireAssignee;
