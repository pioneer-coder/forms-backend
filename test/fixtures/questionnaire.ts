import { nanoid } from 'nanoid';
import { pgModels, pgRepositories } from '@/dbs/typeorm/index.js';
import setFixtureValues from './setFixtureValues.js';

type RequiredFields = 'questionnaireTemplateId';
type Options =
  & Partial<Omit<pgModels.Questionnaire, RequiredFields >>
  & Required<Pick<pgModels.Questionnaire, RequiredFields>>

const createQuestionnaire = async (opts: Options): Promise<pgModels.Questionnaire> => {
  const createdQuestionnaire = await setFixtureValues(
    new pgModels.Questionnaire(),
    opts,
    {
      creatorId: () => nanoid(),
      status: () => 'in-progress' as pgModels.Questionnaire['status'],
    },
  );

  return await pgRepositories.questionnaire.save(createdQuestionnaire);
};

export default createQuestionnaire;
