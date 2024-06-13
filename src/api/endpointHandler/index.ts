import {
  Request,
  Response,
  RequestHandler,
  NextFunction,
} from 'express';
import Bluebird from 'bluebird';

import deserializeQuery, { BuildOptions } from '@/utils/deserializeQuery/index.js';
import sentry from '@/interfaces/sentry/index.js';

type Handler<P, ResBody, ReqBody, ReqQuery> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
) => void | Promise<void>;

const hygraphEndpointHandler = <Data>(
  handler: Handler<void, { correlationId: string }, { operation: string; data: Data }, void>,
): RequestHandler<void, { correlationId: string}, { operation: string; data: Data }, void> => async (
    req: Request<void, { correlationId: string}, { operation: string; data: Data }, void>,
    res: Response<{ correlationId: string}>,
  ): Promise<void> => {
    const correlationId = req.cid;
    res.status(200).json({ correlationId });
    await Bluebird.delay(60 * 1000);
    try {
      await handler(req, res);
    } catch (error) {
      req.log.error(error, 'hygraphEndpointHandler-failed');
      sentry.captureException(error);
    }
  };

export { hygraphEndpointHandler };

// Things can be optional from the POV of the API.
// But can be guarnanteed on req.query (with defaultValue).
// Use this generic type to convert certain properties from optional to required.
// For example, this gives { page: number, perPage: number, q?: string }
// QueryItemsWithDefault<{ page?: number, perPage?: number, q?: string }, 'page' | 'perPage'>
export type QueryItemsWithDefault<Q, RK extends keyof Q> = Omit<Partial<Q>, RK> & Required<Pick<Q, RK>>;

type Options<Q> = {
  query: BuildOptions<Q>;
};

type BaseApiDefinition = {
  query: unknown;
  body: unknown;
  params: unknown;
  response: unknown;
};

// @todo - merge with endpointHandler
// If there are no opts, there can't be any req.query
function endpointWithQueryHandler<
  API extends BaseApiDefinition,
  P = API['params'],
  SB = API['response'],
  QB = API['body'],
  Q = API['query']
>(
  handler: Handler<P, SB, QB, Q>,
): RequestHandler<P, SB, QB, Q>

function endpointWithQueryHandler<
  API extends BaseApiDefinition,
  P = API['params'],
  SB = API['response'],
  QB = API['body'],
  Q = Partial<API['query']>,
>(
  handler: Handler<P, SB, QB, Q>,
  options: Options<Q>,
): RequestHandler<P, SB, QB, Q>

function endpointWithQueryHandler<
  API extends BaseApiDefinition,
  DefQ extends keyof API['query'],
  P = API['params'],
  SB = API['response'],
  QB = API['body'],
  Q = QueryItemsWithDefault<API['query'], DefQ>,
>(
  handler: Handler<P, SB, QB, Q>,
  options: Options<Q>,
): RequestHandler<P, SB, QB, Q>

function endpointWithQueryHandler<
  API extends BaseApiDefinition,
  DefQ extends keyof API['query'],
  P = API['params'],
  SB = API['response'],
  QB = API['body'],
  Q = QueryItemsWithDefault<API['query'], DefQ>
>(
  handler: Handler<P, SB, QB, Q>,
  options?: Options<Q>,
): RequestHandler<P, SB, QB, Q> {
  return async (
    req: Request<P, SB, QB, Q>,
    res: Response<SB>,
    next: NextFunction,
  ) => {
    try {
      if (options?.query) {
        const deserializedOptions = deserializeQuery(
          req.query || {},
          options.query,
        );
        // Hold onto the originals, just in case.
        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
        (req as any)._unserializedQuery = req.query;
        // Don't check types here, assume that if the options are right it gets cast correctly.
        req.query = deserializedOptions;
      }
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

export default endpointWithQueryHandler;
