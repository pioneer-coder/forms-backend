import type { BaseHandler, Deserializer, Handler } from '../typings.js';
import getEnvVar from '../getEnvVar.js';

type ThisType = number;

const strToInt = (str: string): ThisType => parseInt(str, 10);

const deserializer: Deserializer<ThisType> = (str, key, { defaultValue = null } = {}) => {
  let val: ThisType | null = defaultValue;

  if (str) {
    val = strToInt(str);
    if (Number.isNaN(val)) {
      throw new Error(`Bad value for constant: ${key} (${str}).`);
    }
  }

  return val;
};

const handler: BaseHandler<ThisType> = (key, { defaultValue = null, isRequired = true } = {}) => {
  const str = getEnvVar(key);

  const val = deserializer(str, key, { defaultValue });

  if (isRequired && val === null) {
    throw new Error(`Missing value for constant: ${key}.`);
  }

  return val;
};

type ThisHandler = Handler<ThisType>
const isInteger: ThisHandler = handler as ThisHandler;
isInteger.deserializer = deserializer;

export default isInteger;
