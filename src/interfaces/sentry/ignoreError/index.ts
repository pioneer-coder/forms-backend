import type * as Sentry from '@sentry/node';

import configuration from '@/configuration/index.js';
import { ForbiddenError, RateLimitError } from '@/errors/index.js';

const isIgnoredClientVersion = (
  clientVersion: number | string | boolean | bigint | symbol | null | undefined,
): boolean => {
  if (!clientVersion || typeof clientVersion !== 'string') {
    return false;
  }

  if (configuration.SENTRY_ENVIRONMENT === 'production') {
    return /^(development|qa)/.test(clientVersion);
  }

  if (configuration.SENTRY_ENVIRONMENT === 'qa') {
    return /^(development)/.test(clientVersion);
  }

  return false;
};

const ignoreError = ({ event, error }: { event: Sentry.Event; error: unknown }): boolean => isIgnoredClientVersion(event?.tags?.clientVersion)
  || error instanceof RateLimitError
  || (error instanceof ForbiddenError && event?.tags?.isOnBehalfOf === true);

export default ignoreError;
