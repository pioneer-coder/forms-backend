import { SinonSpy } from 'sinon';
import { BaseFunction } from '../src/typings/utility.js';

const getCallsCount = <F extends BaseFunction>(fn: F): number => (fn as unknown as SinonSpy).callCount;

export default getCallsCount;
