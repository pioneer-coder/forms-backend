import dayjs from 'dayjs';
import sentry from '@/interfaces/sentry/index.js';
import getSingleItem from './getSingleItem.js';
import { QueryStringItem } from './typings.js';

export type Options = {
  type: 'date';
  defaultValue?: string;
};

const DATE_TIME_RE = /^\d{4}-\d{2}-\d{2}$/;

function handleDate(item: QueryStringItem): string | undefined
function handleDate(item: QueryStringItem, opts: Options & { defaultValue?: never }): string | undefined;
function handleDate(item: QueryStringItem, opts: Options & { defaultValue: string }): string;
function handleDate(item: QueryStringItem, opts?: Options): string | undefined {
  let value = getSingleItem(item, { nullishStringIsNullish: true });
  if (value === undefined || value === null || value === '') {
    const defaultValue = opts?.defaultValue;
    if (!defaultValue) {
      return undefined;
    }
    value = defaultValue;
  }

  if (DATE_TIME_RE.test(value)) {
    return value;
  }

  const asObj = dayjs(value);

  if (asObj.isValid()) {
    return asObj.format('YYYY-MM-DD');
  }

  sentry.captureException(new Error('Problem trying to deserialize date'), { extra: { item } });
  return undefined;
}

export default handleDate;
