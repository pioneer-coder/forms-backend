import { DataSource, Repository } from 'typeorm';
import * as pgModels from './entity/index.js';

type RepositoriesMap = {
  apiKey: Repository<pgModels.ApiKey>;
  fieldAssigneeTemplate: Repository<pgModels.FieldAssigneeTemplate>;
  fieldTemplate: Repository<pgModels.FieldTemplate>;
  pdfFieldTemplate: Repository<pgModels.PdfFieldTemplate>;
  pdfTemplate: Repository<pgModels.PdfTemplate>;
  questionnaire: Repository<pgModels.Questionnaire>;
  questionnaireAssigneeTemplate: Repository<pgModels.QuestionnaireAssigneeTemplate>;
  questionnaireAssignee: Repository<pgModels.QuestionnaireAssignee>;
  questionnaireResponse: Repository<pgModels.QuestionnaireResponse>;
  questionnaireTemplate: Repository<pgModels.QuestionnaireTemplate>;
  sectionTemplate: Repository<pgModels.SectionTemplate>;
}

const createRepositories = (dataSource: DataSource): RepositoriesMap => ({
  apiKey: dataSource.getRepository(pgModels.ApiKey),
  fieldAssigneeTemplate: dataSource.getRepository(pgModels.FieldAssigneeTemplate),
  fieldTemplate: dataSource.getRepository(pgModels.FieldTemplate),
  pdfFieldTemplate: dataSource.getRepository(pgModels.PdfFieldTemplate),
  pdfTemplate: dataSource.getRepository(pgModels.PdfTemplate),
  questionnaire: dataSource.getRepository(pgModels.Questionnaire),
  questionnaireAssignee: dataSource.getRepository(pgModels.QuestionnaireAssignee),
  questionnaireAssigneeTemplate: dataSource.getRepository(pgModels.QuestionnaireAssigneeTemplate),
  questionnaireResponse: dataSource.getRepository(pgModels.QuestionnaireResponse),
  questionnaireTemplate: dataSource.getRepository(pgModels.QuestionnaireTemplate),
  sectionTemplate: dataSource.getRepository(pgModels.SectionTemplate),
});

export default createRepositories;
