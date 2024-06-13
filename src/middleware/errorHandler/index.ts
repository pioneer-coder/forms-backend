/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response, Request } from 'express';
import { ServerError } from '@/errors/index.js';
import logger from '@/utils/logger/index.js';
import deepSanitize from '@/utils/deepSanitize/index.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- needs 4 arguments so that the first is the error
export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  // console.log('\n\n-e-', err.stack);
  // console.log(JSON.stringify(err, null, 2));
  const log = req.log || logger;

  if (req.url === '/webhooks/routable' && err) {
    res.status(401).json();
    log.error(err, 'Routable Error');
    return;
  }

  const asServerError = ServerError.asServerError(err);
  if (asServerError !== err) {
    log.error(err, 'Original Error');
  }
  log.error({ err: asServerError.toLog() }, 'Returned Error');
  if (req.body) {
    log.error({ body: deepSanitize(req.body) }, 'failedRequestsBody');
  }

  res
    .status(asServerError.statusCode)
    .json({ ...asServerError.response, correlationId: req.cid });
}
