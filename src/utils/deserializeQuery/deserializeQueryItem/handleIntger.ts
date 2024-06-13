import sentry from '@/interfaces/sentry/index.js';
import getSingleItem from './getSingleItem.js';
import { QueryStringItem } from './typings.js';

type BaseOptions = {
  type: 'integer';
  min?: number;
  max?: number;
  defaultValue?: number;
};

export type Options = BaseOptions;

function handleInteger(item: QueryStringItem): number | undefined
function handleInteger(item: QueryStringItem, opts: Options & { defaultValue?: never }): number | undefined;
function handleInteger(item: QueryStringItem, opts: Options & { defaultValue: number }): number;
function handleInteger(item: QueryStringItem, opts?: Options): number | undefined {
  const value = getSingleItem(item, { nullishStringIsNullish: true });
  let parsed: number | null = null;

  if (value !== null && value !== undefined && value !== '') {
    parsed = parseFloat(value);
  }

  if (typeof parsed === 'number' && Number.isNaN(parsed)) {
    sentry.captureException(new Error('Problem trying to deserialize integer'), { extra: { item } });
    parsed = null;
  }

  const defaultValue = opts?.defaultValue ?? null;
  const min = opts?.min ?? null;
  const max = opts?.max ?? null;

  if (min !== null && max !== null && max < min) {
    sentry.captureException(new Error('Problem trying to deserialize integer, max less than min'), { extra: { item, max, min } });
  }

  if (defaultValue !== null) {
    if ((min !== null && defaultValue < min) || ((max !== null) && (defaultValue > max))) {
      sentry.captureException(new Error('Problem trying to deserialize integer, default out of range'), {
        extra: {
          defaultValue, item, max, min,
        },
      });
    }
  }

  if (parsed === null) {
    parsed = defaultValue;
  }

  if (parsed === null) {
    return undefined;
  }

  if (min !== null) {
    parsed = Math.max(min, parsed);
  }

  if (max !== null) {
    parsed = Math.min(max, parsed);
  }

  return Math.round(parsed);
}

export default handleInteger;
