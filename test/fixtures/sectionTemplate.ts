import { pgModels, pgRepositories } from '@/dbs/typeorm/index.js';
import setFixtureValues from './setFixtureValues.js';
import slug from './slug.js';

type RequiredFields = 'questionnaireTemplateId';
type Options =
  & Partial<Omit<pgModels.SectionTemplate, RequiredFields >>
  & Required<Pick<pgModels.SectionTemplate, RequiredFields>>

const createSectionTemplate = async (opts: Options): Promise<pgModels.SectionTemplate> => {
  const section = await setFixtureValues(
    new pgModels.SectionTemplate(),
    opts,
    {
      label: () => 'A subset of questions',
      rank: () => 1,
      slug: () => slug(),
    },
  );

  return await pgRepositories.sectionTemplate.save(section);
};

export default createSectionTemplate;
