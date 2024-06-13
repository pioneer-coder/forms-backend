import { SinonStub } from 'sinon';
import { BaseFunction } from '../src/typings/utility.js';

// @todo make sure that null is a possible response
function doubleReturns<F extends BaseFunction>(fn: F, value: null): null;

function doubleReturns<F extends BaseFunction>(
  fn: F,
  value: Exclude<Awaited<ReturnType<F>>, null>,
  opts?: { isPromise?: boolean }
): Exclude<Awaited<ReturnType<F>>, null>;
function doubleReturns<F extends BaseFunction>(
  fn: F,
  value: Awaited<ReturnType<F>>,
  { isPromise = true } = {},
): Awaited<ReturnType<F>> {
  if (isPromise) {
    (fn as unknown as SinonStub).returns(Promise.resolve(value));
  } else {
    (fn as unknown as SinonStub).returns(value);
  }
  return value;
}

export default doubleReturns;
