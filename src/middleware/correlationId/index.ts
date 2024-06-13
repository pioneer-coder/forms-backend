import { Request, Response, NextFunction } from 'express';
import sentry from '@/interfaces/sentry/index.js';
import defaultLogger from '@/utils/logger/index.js';
import generateCID, { cidLocalStorage } from '@/utils/correlationId/index.js';

declare module 'http' {
  interface IncomingMessage {
    cid: string;
  }
}

export const HEADER_KEY = 'x-correlationid';

const getCidFromHeader = (req: Request): string | null => {
  try {
    const keyInHeader = req.headers?.[HEADER_KEY];
    if (!keyInHeader) {
      return null;
    }
    if (Array.isArray(keyInHeader)) {
      if (keyInHeader.length === 0) {
        return null;
      }
      return keyInHeader[0];
    }
    return keyInHeader;
  } catch (error) {
    (req.log || defaultLogger).error(error, 'extract-cid-from-header');
    return null;
  }
};

const correlationId = (req: Request, res: Response, next: NextFunction): void => {
  let cid = getCidFromHeader(req);
  if (!cid) {
    cid = generateCID('api');
  }
  req.cid = cid;
  res.set('x-correlationId', cid);
  sentry.setCorrelationId(cid);
  cidLocalStorage.run(cid, () => next());
};

export default correlationId;
