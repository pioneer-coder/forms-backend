import type { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Middleware = (req: Request<any, any, any, any>, res: Response<any>, next: NextFunction) => void;
