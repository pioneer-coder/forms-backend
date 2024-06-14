import { z } from 'zod';
import { pino } from 'pino';
import { ServerError } from '../../errors/index.js';
import getTypedKeys from '../../utils/getTypedKeys.js';
import coerceStringToValue from './coerceStringToValue.js';

const log = pino({
  level: process.env.LOG_LEVEL || 'info',
});

type Environment = Record<string, string | undefined | null>
type Configuration<T extends Record<string, z.ZodTypeAny>> = { [K in keyof T]: z.infer<T[K]> }

const getCoercedValues = <T extends Record<string, z.ZodTypeAny>>(env: Environment, schema: T): Configuration<T> => {
  const values: Partial<Configuration<T>> = {};
  let firstError: Error | null = null;

  getTypedKeys(schema).forEach((key) => {
    const coercedValue = coerceStringToValue(env[key], schema[key]);
    try {
      values[key] = schema[key].parse(coercedValue);
    } catch (error) {
      const message = `Failed to build configuration: ${key as string}`;
      log.error(error, message);
      // console.log('-E-', JSON.stringify(error, null, 2));
      const thisError = error instanceof z.ZodError
        ? new ServerError(message, { issues: error.issues })
        : error as Error;

      if (!firstError) {
        firstError = thisError;
      }
    }
  });

  if (firstError) {
    throw firstError;
  }

  return values as Configuration<T>;
};

const buildConfiguration = <T extends Record<string, z.ZodTypeAny>>(env: Environment, schema: T): Configuration<T> => getCoercedValues(env, schema);

export default buildConfiguration;
