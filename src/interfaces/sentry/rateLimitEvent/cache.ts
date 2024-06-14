import type { Event } from '@sentry/types';

import eventToKey from './eventToKey.js';

export type CacheItem = {
  firstSeen: number; // epoch time
  count: number;
};

const TTL = 24 * 60 * 60 * 1000;

const cache: Record<string, CacheItem> = {};
const isExpired = (item: CacheItem): boolean => Date.now() - item.firstSeen > TTL;

const newItem = (): CacheItem => ({
  count: 0,
  firstSeen: Date.now(),
});

export const add = (event: Event): CacheItem | null => {
  const key = eventToKey(event);

  if (!key) {
    return null;
  }

  if (!cache[key] || isExpired(cache[key])) {
    cache[key] = newItem();
  }

  cache[key].count += 1;

  return cache[key];
};

export const clear = (): void => {
  Object.keys(cache).forEach((k) => delete cache[k]);
};
