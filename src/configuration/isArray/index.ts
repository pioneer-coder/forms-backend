import {
  Deserializer, CastingOptions, CastingResponse, Handler,
} from '../typings.js';
import getEnvVar from '../getEnvVar.js';

interface IsArrayHandler<T> {
   // @todo - the return here should be T[] (not the current (T | null)[]).
   // But then it doesn't match handleVar.
  (key?: string, options?: CastingOptions<(T | null)[]>): CastingResponse<T>[];
  deserializer: Deserializer<(T | null)[]>
}

const isArray = <O>(itemHandler: Handler<O>): IsArrayHandler<O> => {
  const handler = (key?: string): CastingResponse<O>[] => getEnvVar(key)
    .split(',')
    .filter((i) => Boolean(i))
    .map((i) => i.trim())
    .map((str: string) => itemHandler.deserializer(str, key));

  const deserializer: Deserializer<(O | null)[]> = () => {
    throw new Error('No deserialize defined for isArray');
  };
  handler.deserializer = deserializer;
  return handler;
};

export default isArray;
