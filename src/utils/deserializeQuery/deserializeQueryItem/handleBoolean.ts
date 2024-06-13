import sentry from '@/interfaces/sentry/index.js';
import getSingleItem from './getSingleItem.js';
import { QueryStringItem } from './typings.js';

export type Options = {
  type: 'boolean';
  defaultValue?: boolean;
};

function handleBoolean(item: QueryStringItem): boolean | undefined
function handleBoolean(item: QueryStringItem, opts: Options & { defaultValue?: never }): boolean | undefined;
function handleBoolean(item: QueryStringItem, opts: Options & { defaultValue: boolean }): boolean;
function handleBoolean(item: QueryStringItem, opts?: Options): boolean | undefined {
  const value = getSingleItem(item, { nullishStringIsNullish: true });
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }

  if (value !== undefined) {
    sentry.captureException(new Error('Problem trying to deserialize boolean'), { extra: { item } });
    return false;
  }

  return opts?.defaultValue ?? undefined;
}

export default handleBoolean;
