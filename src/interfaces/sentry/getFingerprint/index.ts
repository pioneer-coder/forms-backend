import type { Event } from '@sentry/types';

import { ForbiddenError, ServerError, UnauthorizedError } from '@/errors/index.js';
import { logWithCid } from '@/utils/logger/index.js';

type Props = {
  error: unknown;
  event?: Event;
};

const getFingerprint = ({ error }: Props): string[] | null => {
  const log = logWithCid();
  try {
    if (error instanceof UnauthorizedError) {
      return ['Unauthorized', '{{ transaction }}'];
    }

    if (error instanceof ForbiddenError) {
      return ['Forbidden', '{{ transaction }}'];
    }

    if (error instanceof ServerError && error.type !== 'ServerError') {
      return ['{{ transaction }}', '{{ stack }}'];
    }
    return null;
  } catch (thrownError) {
    log.error(thrownError, 'failed creating sentry fingerprint');
    return null;
  }
};

export default getFingerprint;
