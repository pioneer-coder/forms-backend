import { pgModels, pgRepositories } from '@/dbs/typeorm/index.js';
import key from '@/utils/key/index.js';
import setFixtureValues from './setFixtureValues.js';

type RequiredFields = 'pdfTemplateId';
type Options =
  & Partial<Omit<pgModels.PdfFieldTemplate, RequiredFields >>
  & Required<Pick<pgModels.PdfFieldTemplate, RequiredFields>>

const createPdfFieldTemplate = async (opts: Options): Promise<pgModels.PdfFieldTemplate> => {
  const pdfFieldTemplate = await setFixtureValues(
    new pgModels.PdfFieldTemplate(),
    opts,
    {
      data: () => null,
      key: () => key({ prefix: 'pf_' }),
      page: () => 1,
      positionHeight: () => 10,
      positionWidth: () => 100,
      positionX: () => 0,
      positionY: () => 0,
    },
  );

  return await pgRepositories.pdfFieldTemplate.save(pdfFieldTemplate);
};

export default createPdfFieldTemplate;
