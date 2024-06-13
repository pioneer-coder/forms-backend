import type { BaseHandler, Handler, Deserializer } from '../typings.js';
import getEnvVar from '../getEnvVar.js';

type ThisType = boolean;

const strToBool = (key: string | undefined, str: string): ThisType => {
  const lstr = str.toLowerCase();

  if (lstr === 'true') {
    return true;
  }

  if (lstr === 'false') {
    return false;
  }

  throw new Error(`Bad value for constant: ${key || 'UNKNOWN'} (${str}).`);
};

const deserializer: Deserializer<ThisType> = (str, key, { defaultValue = null } = {}) => {
  let val: ThisType | null = defaultValue;

  if (str) {
    val = strToBool(key, str);
  }

  return val;
};

const handler: BaseHandler<ThisType> = (key, { defaultValue = null, isRequired = true } = {}) => {
  const str = getEnvVar(key);

  const val = deserializer(str, key, { defaultValue, isRequired });

  if (isRequired && val === null) {
    throw new Error(`Missing value for constant: ${key}.`);
  }

  return val;
};

type ThisHandler = Handler<ThisType>
const isBoolean: ThisHandler = handler as ThisHandler;
isBoolean.deserializer = deserializer;

export default isBoolean;
