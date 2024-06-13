import { NextFunction, Response, Request } from 'express';
import { ForbiddenError, UnauthorizedError } from '@/errors/index.js';
import apiKeysService from '@/services/apiKeys/index.js';

export const HEADER_KEY = 'x-noodle-api-key';

export const getKeyFromHeader = (req: Request): string | null => {
  const keyInHeader = req.headers[HEADER_KEY];
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
};

// would be nice to correctly type req here, but couldn't figure it out and it's typed properly in the next middlware...
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NextMiddleware = (req: any, _res: Response, next: NextFunction) => Promise<void>;

const noodleApiKey = (...allowedApiKeys: string[]): NextMiddleware => (
  async (req, _res, next): Promise<void> => {
    try {
      const keyInHeader = getKeyFromHeader(req);
      if (!keyInHeader) {
        throw new UnauthorizedError();
      }

      const apiKey = await apiKeysService.getByKey({ key: keyInHeader });

      if (req.log) {
        req.log.info({ apiKey }, 'noodle-api-key');
      }

      if (!apiKey) {
        throw new ForbiddenError();
      }

      if (!allowedApiKeys.includes(apiKey.slug)) {
        throw new ForbiddenError();
      }
      next();
    } catch (error) {
      next(error);
    }
  }
);

export default noodleApiKey;
