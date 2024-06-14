/*
 * This is to prevent sending > 100k of the same event to sentry in 10 hours again.
 * Eventually store this in redis to share between instances and deploys.
 * But for now just do it in memory.
 */
import type { Event } from '@sentry/types';

import { logWithCid } from '@/utils/logger/index.js';

import * as cache from './cache.js';

const LIMIT = 500;

const didItemHitLimit = (item: cache.CacheItem | null): boolean => {
  if (!item) {
    return false;
  }
  return item.count > LIMIT;
};
const rateLimitEvent = (event: Event): boolean => {
  const logger = logWithCid();
  try {
    const item = cache.add(event);
    const hitLimit = didItemHitLimit(item);
    if (hitLimit) {
      logger.info(event, 'sentry-rate-hit-rate-limit');
    }
    return hitLimit;
  } catch (error) {
    logger.error(error, 'sentry-rate-limit-check-error');
    return false;
  }
};

export default rateLimitEvent;
