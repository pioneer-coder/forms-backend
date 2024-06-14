import * as Sentry from '@sentry/node';
import type { SeverityLevel } from '@sentry/types';

import type { Middleware } from './typings.js';

const severityMiddlewareFactory = (severity: SeverityLevel): Middleware => (_req, _res, next) => {
  Sentry.getCurrentScope().setLevel(severity);
  next();
};

export default severityMiddlewareFactory;
