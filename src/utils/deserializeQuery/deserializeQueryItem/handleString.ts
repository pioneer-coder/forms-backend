import sentry from '@/interfaces/sentry/index.js';
import getSingleItem from './getSingleItem.js';
import { QueryStringItem } from './typings.js';

export type Options = {
  type: 'string';
  enum?: string[];
  defaultValue?: string;
};

const checkEnum = (item: string | null, allowed?: string[]): void => {
  if (item && allowed) {
    if (!allowed.includes(item)) {
      sentry.captureException(new Error('Value not allowed'), { extra: { enum: allowed, item } });
    }
  }
};

function handleString<Response = string>(item: QueryStringItem): Response | undefined
function handleString<Response = string>(item: QueryStringItem, opts: Options & { defaultValue?: never }): Response | undefined;
function handleString<Response = string>(item: QueryStringItem, opts: Options & { defaultValue: string }): Response;
function handleString<Response = string>(item: QueryStringItem, opts?: Options): Response | undefined {
  let value = getSingleItem(item);

  const defaultValue = opts?.defaultValue ?? undefined;
  if (value === undefined && defaultValue !== undefined) {
    value = defaultValue;
  }

  if (value) {
    checkEnum(value, opts?.enum);
  }

  return value as unknown as Response;
}

export default handleString;
