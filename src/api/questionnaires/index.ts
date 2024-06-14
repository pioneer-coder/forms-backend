import { Router } from 'express';
import { ReqUser } from '@/typings/common.js';
import { allowedMethods, authorizeAnyUser } from '@/middleware/index.js';
import quetionnaireResponseService from '@/services/questionnaireResponse/index.js';

import endpointWithQueryHandler from '../endpointHandler/index.js';
import ApiDefinitions from '../ApiDefinitions.js';
import { makePaginatedResponse, deserializeQueryPaginationOptions } from '../helpers/pagination/index.js';
import presenters from './presenters/index.js';

const router = Router();

router
  .route('/:questionnaireId/responses')
  .get(
    authorizeAnyUser,
    endpointWithQueryHandler<ApiDefinitions['/questionnaires/{questionnaireId}/responses']['GET'], 'page' | 'perPage'>(async (req, res) => {
      const { page, perPage } = req.query;
      const response = await quetionnaireResponseService.getQuestionnaireResponses({
        questionnaireId: req.params.questionnaireId,
        requester: req.user as ReqUser, // valid because of authorizeAnyUser
      });
      res.status(200).json(makePaginatedResponse({
        page,
        perPage,
        presenter: presenters.response,
        ...response,
      }));
    }, {
      query: deserializeQueryPaginationOptions,
    }),
  )
  .put(
    authorizeAnyUser,
    endpointWithQueryHandler<ApiDefinitions['/questionnaires/{questionnaireId}/responses']['PUT']>(async (req, res) => {
      const responses = await quetionnaireResponseService.updateQuestionnaireResponses({
        questionnaireId: req.params.questionnaireId,
        requester: req.user as ReqUser, // valid because of authorizeAnyUser
        responses: req.body,
      });
      res.status(200).json(responses.map((response) => presenters.response(response)));
    }),
  )
  .all(allowedMethods('GET', 'PUT'));

export default router;
