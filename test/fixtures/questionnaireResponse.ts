import { nanoid } from 'nanoid';
import { pgModels, pgRepositories } from '@/dbs/typeorm/index.js';
import setFixtureValues from './setFixtureValues.js';

type RequiredFields = 'questionnaireId' | 'fieldTemplateId';
type Options =
  & Partial<Omit<pgModels.QuestionnaireResponse, RequiredFields >>
  & Required<Pick<pgModels.QuestionnaireResponse, RequiredFields>>

const createQuestionnaireResponse = async (opts: Options): Promise<pgModels.QuestionnaireResponse> => {
  const questionnaireResponse = await setFixtureValues(
    new pgModels.QuestionnaireResponse(),
    opts,
    {
      submittedById: () => nanoid(),
      value: () => null,
    },
  );

  return await pgRepositories.questionnaireResponse.save(questionnaireResponse);
};

export default createQuestionnaireResponse;
