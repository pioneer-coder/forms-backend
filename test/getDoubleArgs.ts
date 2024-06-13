import { SinonSpy } from 'sinon';
import { BaseFunction } from '../src/typings/utility.js';

type Opts = {
  call?: number;
}

const getDoubleArgs = <F extends BaseFunction>(
  fn: F,
  { call = 1 }: Opts = {},
): Parameters<F> => {
  const numCalls = (fn as unknown as SinonSpy).callCount;
  if (call > numCalls) {
    throw new Error(`Trying to get call=${call}, but there are only ${numCalls} calls`);
  }
  if (call < 1) {
    throw new Error(`Trying to get call=${call}, but most be >= 1`);
  }
  return (fn as unknown as SinonSpy).getCall(call - 1).args as Parameters<F>;
};

export default getDoubleArgs;
