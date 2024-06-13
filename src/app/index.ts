import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import nocache from 'nocache';
import {
  bodyParser,
  correlationId,
  cors,
  errorHandler,
  fourOhFour,
  authenticate,
  logger as loggerMiddleware,
  logRequestBody,
  clientVersion,
  securityHeaders,
} from '@/middleware/index.js';
// import sentryInterface from '@/interfaces/sentry/index.js';

import api from '@/api/index.js';

const app: Application = express();
app.set('etag', false);
app.set('trust proxy', true);
// app.use(sentryInterface.requestHandler);
// app.use(sentryInterface.tracingHandler);
// app.use(sentryInterface.setCommonTags);
app.use(securityHeaders);
app.use(correlationId);
app.use(clientVersion);
app.use(nocache());
app.use(loggerMiddleware);
app.use(cors);
app.use(cookieParser());
app.use(authenticate);
app.use(bodyParser.json);
app.use(logRequestBody);
app.use(api);
app.use(fourOhFour);
// app.use(sentryInterface.errorHandler);
app.use(errorHandler);

export default app;
