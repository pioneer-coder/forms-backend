import getTypedKeys from '@/utils/getTypedKeys.js';
import deserializeQueryItem, { BuildOption } from '@/utils/deserializeQuery/deserializeQueryItem/index.js';
import deserializeArrayOfStrings from './deserializeArrayOfStrings.js';

export type QueryValue = undefined | string | string[]
export type QueryInput = Record<string, QueryValue>;
export type BuildOptions<O> = {
  [K in keyof O]-?: BuildOption<O[K]>
}

function deserializeQuery<Output>(
  queryObject: QueryInput,
  options: BuildOptions<Output>,
): Output {
  const deserialized: Partial<Output> = {};
  getTypedKeys(options)
    .forEach((key) => {
      const thisOpt = options[key];
      const thisVal = queryObject[key as string];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const deserializedValue = deserializeQueryItem(thisVal, thisOpt as any) as Output[keyof Output];
      if (deserializedValue !== undefined) {
        deserialized[key as keyof Output] = deserializedValue;
      }
    });

  return deserialized as Output;
}

export default deserializeQuery;
export {
  deserializeArrayOfStrings,
  deserializeQueryItem,
};
