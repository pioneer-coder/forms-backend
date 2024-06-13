import { pgModels, pgRepositories } from '@/dbs/typeorm/index.js';
import { nanoid } from 'nanoid';
import setFixtureValues from './setFixtureValues.js';
import slug from './slug.js';

type Options =
  & Partial<pgModels.QuestionnaireTemplate>

const createQuestionnaireTemplate = async (opts: Options = {}): Promise<pgModels.QuestionnaireTemplate> => {
  const booking = await setFixtureValues(
    new pgModels.QuestionnaireTemplate(),
    opts,
    {
      creatorId: () => nanoid(),
      label: () => 'Some Questionnaire',
      slug: () => slug(),
      status: () => 'current' as pgModels.QuestionnaireTemplate['status'],
      version: () => 1,
    },
  );

  return await pgRepositories.questionnaireTemplate.save(booking);
};

export default createQuestionnaireTemplate;
