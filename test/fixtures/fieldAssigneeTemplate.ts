import { pgModels, pgRepositories } from '@/dbs/typeorm/index.js';
import setFixtureValues from './setFixtureValues.js';

type RequiredFields = 'questionnaireAssigneeTemplateId' | 'fieldTemplateId';
type Options =
  & Partial<Omit<pgModels.FieldAssigneeTemplate, RequiredFields >>
  & Required<Pick<pgModels.FieldAssigneeTemplate, RequiredFields>>

const createFieldAssigneeTemplate = async (opts: Options): Promise<pgModels.FieldAssigneeTemplate> => {
  const fieldAssigneeTemplate = await setFixtureValues(
    new pgModels.FieldAssigneeTemplate(),
    opts,
    {},
  );

  return await pgRepositories.fieldAssigneeTemplate.save(fieldAssigneeTemplate);
};

export default createFieldAssigneeTemplate;
