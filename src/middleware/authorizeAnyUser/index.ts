import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '@/errors/index.js';

const authorizeAnyUser = <Params, ResBody, ReqBody, ReqQuery>(
  req: Request<Params, ResBody, ReqBody, ReqQuery>,
  _res: Response<ResBody>,
  next: NextFunction,
): void => {
  const { user } = req;
  if (!user || user.isAnonymous) {
    next(new UnauthorizedError());
  } else {
    next();
  }
};

const wrapped = <Params, ResBody, ReqBody, ReqQuery>(
  req: Request<Params, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction,
): void => wrapped.authorizeAnyUser(req, res, next);

wrapped.authorizeAnyUser = authorizeAnyUser;

export default wrapped;
