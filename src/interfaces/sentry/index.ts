import * as Sentry from '@sentry/node';

import addSentryTagMiddleware from './addSentryTagMiddleware.js';
import gracefulShutdown from './gracefulShutdown.js';
import initialize from './initialize.js';
import setClientVersion from './setClientVersion.js';
import setCorrelationId from './setCorrelationId.js';
import setUser from './setUser.js';
import setupExpressErrorHandler from './setupExpressErrorHandler.js';
import severityMiddlewareFactory from './severityMiddlewareFactory.js';

initialize();

export default {
  addSentryTagMiddleware,
  captureException: Sentry.captureException,
  gracefulShutdown,
  setClientVersion,
  setCorrelationId,
  setUser,
  setupExpressErrorHandler,
  severityMiddlewareFactory,
};
