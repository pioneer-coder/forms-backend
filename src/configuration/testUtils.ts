import _ from 'lodash';

let ENV_BU: Record<string, unknown> = {};
let ENV_BU_KEYS: string[] = [];

export const backupEnv = (...keys: string[]): void => {
  ENV_BU_KEYS = keys;
  ENV_BU = _.pick(process.env, ...keys);
};

export const restoreEnv = (): void => {
  ENV_BU_KEYS.forEach((key) => {
    if (ENV_BU[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = ENV_BU[key] as string;
    }
  });
};
