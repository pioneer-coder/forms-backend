/* eslint-disable mocha/no-top-level-hooks */
import * as chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import chaiSinon from 'sinon-chai';
import Bluebird from 'bluebird';

import pgDataSource from '@/dbs/typeorm/index.js';
import logger from '@/utils/logger/index.js';
import { restore as restoreConfiguration } from '@/configuration/index.js';
import noodleApiInterface from '@/interfaces/noodleApi/index.js';

import promiseForAllServices from './loadAllServices.js';

import clearPostgresDB from './clearPostgresDB.js';

chai.use(chaiAsPromised);
chai.use(chaiShallowDeepEqual);
chai.use(chaiSinon);

type GenericInterface = Record<string, unknown>;

const METHODS_TO_SKIP = [
  'constructor',
  '__defineGetter__',
  '__defineSetter__',
  'hasOwnProperty',
  '__lookupGetter__',
  '__lookupSetter__',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  'toLocaleString',
];

const getMethods = (obj: GenericInterface): string[] => {
  const properties: Set<string> = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
    // eslint-disable-next-line no-cond-assign
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter((item) => typeof obj[item] === 'function');
};

const shouldStub = (methodName: string, dontStub: Array<string>): boolean => !METHODS_TO_SKIP.includes(methodName) && !dontStub.includes(methodName);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stubMethod = (ifc: any, name: string, methodName: string): void => {
  const msg = `Calling ${name}.${methodName} without specifying the return. Add something like ${name}.${methodName}.returns(desiredResponse) to your test.`;
  sinon.stub(ifc, methodName).throws(msg);
};

const stubAllMethods = (ifc: GenericInterface, { name, dontStub = [] }: { name: string, dontStub?: Array<string> }): void => {
  getMethods(ifc)
    .filter((methodName) => shouldStub(methodName, dontStub))
    .forEach((methodName) => {
      stubMethod(ifc, name, methodName);
    });
};

before(async function () {
  if (!pgDataSource.isInitialized) {
    await pgDataSource.initialize();
  }
});

after(async function () {
  await (pgDataSource as NonNullable<typeof pgDataSource>).destroy();
});

beforeEach(async function () {
  // clear the DB before tests so that we can see the state after for failing tests
  await clearPostgresDB();

  sinon.spy(logger, 'debug');
  sinon.spy(logger, 'error');
  sinon.spy(logger, 'info');
  sinon.spy(logger, 'silent');
  sinon.spy(logger, 'trace');
  sinon.spy(logger, 'warn');

  stubAllMethods(noodleApiInterface, { name: 'noodleApiInterface' });
});

afterEach(async function () {
  sinon.restore();
  restoreConfiguration();
  await Bluebird.each(
    promiseForAllServices,
    (service) => (typeof service?.removeAllListeners === 'function') && service.removeAllListeners(),
  );
});
