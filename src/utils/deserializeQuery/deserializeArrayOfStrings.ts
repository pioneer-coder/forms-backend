import deserializeQueryItem from './deserializeQueryItem/index.js';
import type { QueryValue } from './index.js';

// Quick and dirty, later make deserializeQuery take isArray: true
const arrayOfStrings = (queryValue: QueryValue): string[] => {
  if (!queryValue) {
    return [];
  }

  if (Array.isArray(queryValue)) {
    return queryValue.map((thisValue) => deserializeQueryItem(thisValue, { type: 'string' }) as string);
  }

  return [deserializeQueryItem(queryValue, { type: 'string' }) as string];
};

export default arrayOfStrings;
