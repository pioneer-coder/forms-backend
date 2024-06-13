import { IncomingMessage } from 'node:http';
import { NextFunction, Response } from 'express';
import type { AllowedMethod } from '@/typings/api.js';
import { MethodNotAllowedError } from '@/errors/index.js';

const allowedMethods = (...okMethods: AllowedMethod[]) => (req: IncomingMessage, _res: Response, next: NextFunction) => {
  next(new MethodNotAllowedError(req.method as AllowedMethod, okMethods));
};

export default allowedMethods;
