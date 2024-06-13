import sentry from '@/interfaces/sentry/index.js';
import getSingleItem from './getSingleItem.js';
import { QueryStringItem } from './typings.js';

type BaseEnum = Record<string, unknown>;

export type Options<E> = {
  type: 'enum';
  enum: E;
};

const isAllowed = <E extends BaseEnum>(item: string | undefined, enumObj: E): boolean => {
  if (item) {
    const allowed = Object.values(enumObj);
    if (!allowed.includes(item)) {
      return false;
    }
  }
  return true;
};

const checkAllowed = <E extends BaseEnum>(item: string | undefined, enumObj: E): void => {
  if (!isAllowed(item, enumObj)) {
    sentry.captureException(new Error('Not in enum'), { extra: { enum: enumObj, item } });
  }
};

function handleEnum<E extends BaseEnum>(item: QueryStringItem, opts: Options<E> & { defaultValue: E[keyof E] }): E[keyof E];
function handleEnum<E extends BaseEnum>(item: QueryStringItem, opts: Options<E> & { defaultValue?: never }): E[keyof E] | undefined
function handleEnum<E extends BaseEnum>(item: QueryStringItem, opts: Options<E> & { defaultValue?: E[keyof E] }): E[keyof E] | undefined {
  let value = getSingleItem(item);

  if (value === null || value === undefined) {
    value = undefined;
  }

  if (value === 'undefined' || value === 'null') {
    if (!isAllowed(value, opts.enum)) {
      value = undefined;
    }
  }

  if (value === undefined) {
    const defaultValue = opts?.defaultValue ?? undefined;
    if (defaultValue !== undefined) {
      value = defaultValue as unknown as string;
    }
  }

  if (value === undefined) {
    return undefined;
  }

  checkAllowed(value, opts.enum);

  return value as unknown as E[keyof E];
}

export default handleEnum;
