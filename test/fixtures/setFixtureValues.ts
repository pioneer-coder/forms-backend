/* eslint-disable no-param-reassign */
import Bluebird from 'bluebird';
import getTypedKeys from '../../src/utils/getTypedKeys.js';

export type GenerateDefaults<T> = {
  [K in keyof T]?: (obj: Partial<T>) => T[K] | Promise<T[K]>;
};

const setFixtureValues = async <T extends object>(
  obj: T,
  values: { [K in keyof T]?: T[K] },
  generateDefaults: GenerateDefaults<T>,
): Promise<T> => {
  getTypedKeys(values).forEach((k) => {
    const value = values[k] as T[typeof k] | undefined;
    if (obj[k] === undefined && value !== undefined) {
      obj[k] = value;
    }
  });

  await Bluebird.each(
    getTypedKeys(generateDefaults),
    async (k) => {
      const fn = generateDefaults[k];
      if (obj[k] === undefined && fn) {
        const value = await fn(obj);
        if (value !== undefined) {
          obj[k] = value;
        }
      }
    },
  );

  return obj;
};

export default setFixtureValues;
