import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { glob } from 'glob';

import Bluebird from 'bluebird';
import BaseService from '@/services/BaseService/index.js';

const FILE_NAME = fileURLToPath(import.meta.url);
const DIR_NAME = path.dirname(FILE_NAME);

const rootServicesDir = path.resolve(DIR_NAME, '..', 'src', 'services');
const potentialServiceFiles = glob.sync(`${rootServicesDir}/*/index.ts`);

// eslint-disable-next-line no-async-promise-executor
const promiseToServices: Promise<Array<BaseService<void>>> = new Promise(async (resolve) => {
  const services: Array<BaseService<void>> = [];
  await Bluebird.each(
    potentialServiceFiles.filter((file) => !/BaseService/.test(file)),
    async (fullFilePath: string): Promise<void> => {
      const pathToImport = fullFilePath.replace(rootServicesDir, '@/services').replace('/index.ts', '/index.js');
      const thisModule = await import(pathToImport);
      const thisService = thisModule.default;
      if (thisService instanceof BaseService) {
        services.push(thisService);
      }
    },
  );
  resolve(services);
});

export default promiseToServices;
