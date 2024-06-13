import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import { pgModels, pgRepositories } from '@/dbs/typeorm/index.js';
import slug from './slug.js';
import setFixtureValues from './setFixtureValues.js';

type RequiredFields = 'questionnaireTemplateId';
type Options =
  & Partial<Omit<pgModels.PdfTemplate, RequiredFields >>
  & Required<Pick<pgModels.PdfTemplate, RequiredFields>>

const createPdfTemplate = async (opts: Options): Promise<pgModels.PdfTemplate> => {
  const pdfTemplate = await setFixtureValues(
    new pgModels.PdfTemplate(),
    opts,
    {
      creatorId: () => nanoid(),
      fileName: () => faker.system.commonFileName('pdf'),
      s3Key: () => nanoid(),
      slug: () => slug(),
      version: () => 1,
    },
  );

  return await pgRepositories.pdfTemplate.save(pdfTemplate);
};

export default createPdfTemplate;
