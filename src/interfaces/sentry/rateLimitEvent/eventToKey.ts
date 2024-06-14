import type { Event } from '@sentry/types';

const eventToKey = (event: Event): string | null => event.transaction || null;

export default eventToKey;
