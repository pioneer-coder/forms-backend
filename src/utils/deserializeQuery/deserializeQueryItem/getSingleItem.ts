import { QueryStringItem } from './typings.js';

type Options = {
  // sometimes "undefined" should be "undefined", other times undefined (same for "null")
  nullishStringIsNullish: boolean;
};

const getSingleItem = (item: QueryStringItem, opts?: Options): string | undefined => {
  if (item === null || item === undefined) {
    return undefined;
  }

  let value : string | undefined;
  if (Array.isArray(item)) {
    value = item.length > 0 ? item[0] : undefined;
  } else {
    value = item;
  }

  if (opts?.nullishStringIsNullish && (value === 'undefined' || value === 'null')) {
    return undefined;
  }

  return value;
};

export default getSingleItem;
