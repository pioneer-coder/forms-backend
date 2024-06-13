import 'dotenv/config';
import _ from 'lodash';
import isArray from './isArray/index.js';
import isBoolean from './isBoolean/index.js';
import isInteger from './isInteger/index.js';
import isString from './isString/index.js';
import type {
  CastingOptions,
  Configuration,
  Handler,
  ConfigurationKeys,
} from './typings.js';
import makePublicValue from './makePublicValue/index.js';
import ENV_VARS from './envVars.js';
import getProjectName from './getProjectName.js';
import getVersion from './getVersion.js';

const configuration: Partial<Configuration> = {};
const publicConfiguration: Record<string, string> = {};

type HandlerOptions<T> = CastingOptions<T> & {
  isPublic?: boolean;
};

const handleEnvVar = <T>(key: string, handler: Handler<T>, options?: HandlerOptions<T>): void => {
  const value = handler(key, options);
  configuration[key as ConfigurationKeys] = value as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  publicConfiguration[key] = makePublicValue(value, options);
};

handleEnvVar<Configuration['CORS_ENABLED_ORIGINS']>('CORS_ENABLED_ORIGINS', isArray(isString), { defaultValue: [], isPublic: true });
handleEnvVar<Configuration['HOST']>('HOST', isString, { isPublic: true });
handleEnvVar<Configuration['JWT_SIGNING_SECRET_PREVIOUS']>('JWT_SIGNING_SECRET_PREVIOUS', isString, { isRequired: true });
handleEnvVar<Configuration['JWT_SIGNING_SECRET']>('JWT_SIGNING_SECRET', isString, { isRequired: true });
handleEnvVar<Configuration['LOG_LEVEL']>('LOG_LEVEL', isString, { defaultValue: 'info', isPublic: true });
handleEnvVar<Configuration['POSTGRES_DB']>('POSTGRES_DB', isString);
handleEnvVar<Configuration['POSTGRES_HOST']>('POSTGRES_HOST', isString);
handleEnvVar<Configuration['POSTGRES_LOG_QUERIES']>('POSTGRES_LOG_QUERIES', isBoolean, { defaultValue: false });
handleEnvVar<Configuration['POSTGRES_NUM_CONNECTIONS']>('POSTGRES_NUM_CONNECTIONS', isInteger, { isRequired: false });
handleEnvVar<Configuration['POSTGRES_PASSWORD']>('POSTGRES_PASSWORD', isString, { isRequired: false });
handleEnvVar<Configuration['POSTGRES_PORT']>('POSTGRES_PORT', isInteger, { defaultValue: 5432 });
handleEnvVar<Configuration['POSTGRES_USER']>('POSTGRES_USER', isString);
handleEnvVar<Configuration['PORT']>('PORT', isInteger, { defaultValue: 3500, isPublic: true });
handleEnvVar<Configuration['PROJECT_NAME']>('PROJECT_NAME', getProjectName, { isPublic: true });
handleEnvVar<Configuration['SHELL_PROMPT']>('SHELL_PROMPT', isString, { defaultValue: 'UNKNOWN$' });
handleEnvVar<Configuration['VERSION']>('VERSION', getVersion, { isPublic: true });

export default configuration as Configuration;
export {
  publicConfiguration,
  Configuration,
  ConfigurationKeys,
  ENV_VARS,
  isInteger,
};

/*
 * This stuff is needed so that we can restore the configuration after tests that need to change it.
 */
const BACKUP = structuredClone(configuration) as Configuration;
const ORIGINAL_KEYS = Object.keys(configuration) as ConfigurationKeys[];

export const restore = (): void => {
  if (process.env.NODE_ENV === 'test') {
    Object.keys(configuration)
      .filter((key) => !ORIGINAL_KEYS.includes(key as ConfigurationKeys))
      .forEach((key) => {
        delete configuration[key as ConfigurationKeys];
      });
    Object.assign(configuration, BACKUP);
  }
};
