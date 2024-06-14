import 'dotenv/config';
import getTypedKeys from '../utils/getTypedKeys.js';
import getProjectName from './getProjectName.js';
import getVersion from './getVersion.js';
import environmentSchema from './environmentSchema.js';
import buildConfiguration from './buildConfiguration/index.js';

const VERSION = getVersion();
const PROJECT_NAME = getProjectName();

const parsedEnvironment = buildConfiguration(process.env, environmentSchema);

const publicConfiguration: Record<string, string> = {
  PROJECT_NAME,
  VERSION,
};

const configuration = {
  ...parsedEnvironment,
  PROJECT_NAME,
  VERSION,
};

export type Configuration = typeof configuration;

export { publicConfiguration };

/*
 * This stuff is needed so that we can restore the configuration after tests that need to change it.
 */
const BACKUP = structuredClone(configuration);
const ORIGINAL_KEYS = getTypedKeys(configuration);

export const restore = (): void => {
  if (process.env.NODE_ENV === 'test') {
    getTypedKeys(configuration)
      .filter((key) => !ORIGINAL_KEYS.includes(key))
      .forEach((key) => {
        delete configuration[key];
      });
    Object.assign(configuration, BACKUP);
  }
};

export default configuration;
