import * as Sentry from '@sentry/node';

import type { Middleware } from './typings.js';

const addSentryTagMiddleware = (tags: Record<string, string>): Middleware => (_req, _res, next) => {
  Sentry.setTags(tags);
  next();
};

export default addSentryTagMiddleware;
