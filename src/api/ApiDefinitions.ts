import { NOKResponse, OKResponse, PaginatedApiDefinition } from '@/typings/api.js';
import * as ApiModels from '@/typings/api-models.js';

type ApiDefinitions = {
  '/health-checks': {
    GET: {
      query: void;
      params: void;
      body: void;
      response: OKResponse | NOKResponse,
    }
  };
  '/health-checks/configuration': {
    GET: {
      query: void;
      params: void;
      body: void;
      response: Record<string, string>,
    }
  };
  '/health-checks/forced-healthy': {
    DELETE: {
      query: void;
      params: void;
      body: void;
      response: OKResponse,
    };
    POST: {
      query: void;
      params: void;
      body: void;
      response: OKResponse,
    };
  }

  '/questionnaires/{questionnaireId}/responses': {
    GET: PaginatedApiDefinition<{
      query: void;
      params: { questionnaireId: string };
      body: void;
      item: ApiModels.QuestionnaireResponse;
    }>;
    PUT: {
      query: void;
      params: { questionnaireId: string };
      body: Array<{
        fieldTemplateId: string;
        key: string;
        value: unknown; // depends on field type
      }>;
      response: Array<ApiModels.QuestionnaireResponse>;
    }
  }
};

export default ApiDefinitions;
