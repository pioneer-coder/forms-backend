import { Request, Response, NextFunction } from 'express';
import sentry from '@/interfaces/sentry/index.js';
import defaultLogger from '@/utils/logger/index.js';

export const HEADER_KEY = 'x-noodle-client-version';

const getFromHeader = (req: Request): string | null => {
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
    (req.log || defaultLogger).error(error, 'extract-client-version-from-header');
    return null;
  }
};

const clientVersion = (req: Request, res: Response, next: NextFunction): void => {
  const thisClientVersion = getFromHeader(req);
  if (thisClientVersion) {
    sentry.setClientVersion(thisClientVersion);
  }
  next();
};

export default clientVersion;
