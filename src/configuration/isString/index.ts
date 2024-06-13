import type { BaseHandler, Deserializer, Handler } from '../typings.js';
import getEnvVar from '../getEnvVar.js';

type ThisType = string;

const deserializer: Deserializer<ThisType> = (str, key, { defaultValue = null } = {}) => {
  let val: ThisType | null = defaultValue;

  if (str && str.length > 0) {
    val = str;
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
const isString: ThisHandler = handler as ThisHandler;
isString.deserializer = deserializer;

export default isString;
