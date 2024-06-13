import * as fixtures from './fixtures/index.js';
import getThrownError, { getAsyncThrownError } from './getThrownError.js';
import doubleReturns from './doubleReturns.js';

export { default as getDoubleArgs } from './getDoubleArgs.js';
export { default as getCallsCount } from './getCallsCount.js';

export {
  doubleReturns,
  getAsyncThrownError,
  getThrownError,
  fixtures,
};
