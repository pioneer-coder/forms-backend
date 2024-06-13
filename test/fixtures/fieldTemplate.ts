import { pgModels, pgRepositories } from '@/dbs/typeorm/index.js';
import key from '@/utils/key/index.js';
import setFixtureValues from './setFixtureValues.js';

type RequiredFields = 'questionnaireTemplateId' | 'sectionTemplateId';
type Options =
  & Partial<Omit<pgModels.FieldTemplate, RequiredFields >>
  & Required<Pick<pgModels.FieldTemplate, RequiredFields>>

const createFieldTemplate = async (opts: Options): Promise<pgModels.FieldTemplate> => {
  const fieldTemplate = await setFixtureValues(
    new pgModels.FieldTemplate(),
    opts,
    {
      key: () => key({ prefix: 'fldt' }),
      label: () => 'Some field',
      options: () => ({}),
      rank: () => 1,
      type: () => 'short-text' as pgModels.FieldTemplate['type'],
    },
  );

  return await pgRepositories.fieldTemplate.save(fieldTemplate);
};

export default createFieldTemplate;
