/*
 * Take a string from the query string and return the value deserialized
 */

import sentry from '@/interfaces/sentry/index.js';
import { QueryStringItem } from './typings.js';
import handleString, { Options as StringOptions } from './handleString.js';
import handleBoolean, { Options as BooleanOptions } from './handleBoolean.js';
import handleDate, { Options as DateOptions } from './handleDate.js';
import handleInteger, { Options as IntegerOptions } from './handleIntger.js';
import handleFloat, { Options as FloatOptions } from './handleFloat.js';
import handleEnum, { Options as EnumOptions } from './handleEnum.js';

export type Options =
  | StringOptions
  | EnumOptions<unknown>
  | BooleanOptions
  | DateOptions
  | IntegerOptions
  | FloatOptions

type PickNonDefaultOptions<T> = Omit<
  string extends NonNullable<T> ? StringOptions | DateOptions
  : number extends NonNullable<T> ? IntegerOptions | FloatOptions
  : boolean extends NonNullable<T> ? BooleanOptions
  : never,
  'defaultValue'
>;

type PickDefaultOption<T> = undefined extends T ? { defaultValue?: never } : { defaultValue: T };

export type BuildOption<T> = PickNonDefaultOptions<T> & PickDefaultOption<T>

// @todo - Type checking of opts here isn't super important. But it would be nice to not have to do `as any`
type AnyOptions = any; // eslint-disable-line @typescript-eslint/no-explicit-any

// @todo parse date-time
// @todo parse date-only
// @todo parse float - should integer use this with round?
// @todo parse array of all of the above (and string);

function deserializeQueryStringItem<Response = string>(item: QueryStringItem): Response | undefined;
function deserializeQueryStringItem<Response = string>(item: QueryStringItem, opts: StringOptions & { defaultValue?: never }): Response | undefined;
function deserializeQueryStringItem<Response = string>(item: QueryStringItem, opts: StringOptions & { defaultValue: string }): Response;
function deserializeQueryStringItem<Response = boolean>(item: QueryStringItem, opts: BooleanOptions & { defaultValue?: never }): Response | undefined;
function deserializeQueryStringItem<Response = boolean>(item: QueryStringItem, opts: BooleanOptions & { defaultValue: boolean }): Response;
function deserializeQueryStringItem<Response = string>(item: QueryStringItem, opts: DateOptions & { defaultValue?: never }): Response | undefined;
function deserializeQueryStringItem<Response = string>(item: QueryStringItem, opts: DateOptions & { defaultValue: string }): Response;
function deserializeQueryStringItem<Response = number>(item: QueryStringItem, opts: IntegerOptions & { defaultValue?: never }): Response | undefined;
function deserializeQueryStringItem<Response = number>(item: QueryStringItem, opts: IntegerOptions & { defaultValue: number }): Response;
function deserializeQueryStringItem<Response = number>(item: QueryStringItem, opts: FloatOptions & { defaultValue?: never }): Response | undefined;
function deserializeQueryStringItem<Response = number>(item: QueryStringItem, opts: FloatOptions & { defaultValue: number }): Response;
function deserializeQueryStringItem<E>(item: QueryStringItem, opts: EnumOptions<E> & { defaultValue?: never }): E[keyof E] | undefined;
function deserializeQueryStringItem<E>(item: QueryStringItem, opts: EnumOptions<E> & { defaultValue: E[keyof E] }): E[keyof E];
function deserializeQueryStringItem<Response = unknown>(item: QueryStringItem, opts?: Options): unknown {
  const type = opts?.type || 'string';
  // @todo - Type checking of opts here isn't super important. But it would be nice to not have to do `as any`

  if (type === 'enum') {
    return handleEnum(item, opts as AnyOptions);
  }

  if (type === 'boolean') {
    return handleBoolean(item, opts as AnyOptions);
  }

  if (type === 'date') {
    return handleDate(item, opts as AnyOptions);
  }

  if (type === 'integer') {
    return handleInteger(item, opts as AnyOptions);
  }

  if (type === 'float') {
    return handleFloat(item, opts as AnyOptions);
  }

  if (type !== 'string') {
    sentry.captureException(new Error('Invalid type'), { extra: { item, type } });
  }

  return handleString<Response>(item, opts as AnyOptions);
}

export default deserializeQueryStringItem;
