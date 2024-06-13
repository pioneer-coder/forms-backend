import { pino } from 'pino';
import { pinoHttp } from 'pino-http';
import { NextFunction, Request, Response } from 'express';
import ServerError from '@/errors/ServerError.js';
import configuration from '@/configuration/index.js';
import deepSanitize from '@/utils/deepSanitize/index.js';
import generateCorrelationId, { getCorrelationId } from '@/utils/correlationId/index.js';

// pino-http is missing the log property on ServerResponse that is added here
// https://github.com/pinojs/pino-http/blob/master/logger.js#L136
// This can be removed if/when this PR is merged https://github.com/pinojs/pino-http/pull/201
declare module 'http' {
  interface ServerResponse {
    log?: pino.Logger<never>;
  }
}
declare module 'express' {
  interface Response {
    log?: pino.Logger<never>;
  }
  interface Request {
    log: pino.Logger<never>;
  }
}

const addPinoMiddlware = pinoHttp<Request, Response, never>({
  autoLogging: {
    ignore: (req) => req.url === '/health-checks',
  },
  // Explicitly logging in the error handler
  customLogLevel: (_req, res) => ((res.statusCode >= 400) ? 'silent' : 'info'),

  customProps: (req) => (req.cid ? { cid: req.cid } : {}),

  customReceivedMessage: () => 'request started',

  genReqId: (req) => (req as { cid?: string })?.cid || generateCorrelationId('api'),

  level: configuration.LOG_LEVEL,

  logger: pino(),

  serializers: {
    err: (err: Error) => {
      const originalError = 'raw' in err ? err.raw : null;
      if (originalError instanceof ServerError) {
        return {
          ...originalError.response,
          details: originalError.details,
          stack: originalError.stack,
        };
      }

      return err;
    },
  },
});

const middleware = (req: Request, res: Response, next: NextFunction): ReturnType<NextFunction> => {
  const originalSendFunc = res.json.bind(res);
  res.json = (body) => {
    const sanitizedBody = deepSanitize(body);
    const logger = res.log || addPinoMiddlware.logger;
    logger.info({ body: sanitizedBody }, 'response-body');
    return originalSendFunc(body);
  };

  return addPinoMiddlware(req, res, next);
};

const extractCid = (log: pino.Logger<string>): string | undefined => {
  const bindings = log.bindings();
  return bindings.req?.id || undefined;
};

export { middleware, extractCid };

export type Logger = pino.Logger<never>;

export const logWithCid = (): Logger => {
  const cid = getCorrelationId();
  return addPinoMiddlware.logger.child<never>({ cid });
};

export default addPinoMiddlware.logger;
