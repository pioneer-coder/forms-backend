import { NextFunction, Request, Response } from 'express';
import authService from '@/services/auth/index.js';
import type { ReqUser } from '@/typings/common.js';
import { Logger } from '@/utils/logger/index.js';
import sentry from '@/interfaces/sentry/index.js';

export type { ReqUser };

declare module 'http' {
  interface IncomingMessage {
    token?: string;
    user?: ReqUser | null;
    userData?: ReqUser | null;
  }
}

const getUserFromToken = ({ token, log }: { token?: string, log?: Logger }): ReqUser | null => {
  if (!token || token === 'undefined') {
    return null;
  }

  try {
    const decoded = authService.verifyAuthToken({ token });
    return decoded;
  } catch (error) {
    if (log) {
      log.error(error, 'Failed to verify the token');
    }
    return null;
  }
};

const authenticate = <Params, ResBody, ReqBody, ReqQuery>(
  req: Request<Params, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction,
): void => {
  const token = req?.token
    || req?.headers?.authorization
    // || req?.cookies?.[configuration.AUTH_COOKIE_KEY]
    || req?.cookies?.nldevu; // to allow localhost to connect to qa and prod servers.

  const log = req.log as typeof req.log | undefined;

  req.user = getUserFromToken({ log, token });
  req.userData = req.user; // @todo - deprecate, but need for backwards compatability.
  if (req.user) {
    const userId = req.user.id;
    if (req.log) {
      req.log = req.log.child({ userId });
    }
    if (res.log) {
      res.log = res.log.child({ userId });
    }
  }

  sentry.setUser(req.user
    ? { id: req.user.id, isOnBehalfOf: req.user.isOnBehalfOf || false }
    : null);

  next();
};

const wrapped = <Params, ResBody, ReqBody, ReqQuery>(
  req: Request<Params, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction,
): void => wrapped.authenticate(req, res, next);

wrapped.authenticate = authenticate;

export default wrapped;
