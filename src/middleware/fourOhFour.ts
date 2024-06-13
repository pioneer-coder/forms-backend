import { NextFunction, Response, Request } from 'express';
import { NotFoundError } from '@/errors/index.js';

export default function fourOhFour(_req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError());
}
