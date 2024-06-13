import { NextFunction, Response, Request } from 'express';
import deepSanitize from '@/utils/deepSanitize/index.js';
import defaultLogger from '@/utils/logger/index.js';

const logRequestBody = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) {
    const logger = req.log || defaultLogger;
    try {
      const sanitizedBody = deepSanitize(req.body);
      logger.info({ body: sanitizedBody }, 'request-body');
    } catch (error) {
      logger.error(error, 'request-body-log-error');
    }
  }
  next();
};

export default logRequestBody;
