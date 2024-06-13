import { expect } from 'chai';
import isArray from './index.js';
import isBoolean from '../isBoolean/index.js';
import { backupEnv, restoreEnv } from '../testUtils.js';
import { Handler } from '../typings.js';

const key = 'A_KEY';
const isPassthrough = {
  deserializer: (value: string): string => value,
} as Handler<string>;

describe('configuration/isArray', function () {
  before(function () {
    backupEnv(key);
  });

  afterEach(function () {
    restoreEnv();
  });

  it('should just wrap a single value in an array', function () {
    process.env[key] = 'single-value';
    expect(isArray(isPassthrough)(key)).to.deep.equal(['single-value']);
  });

  it('should split on commas', function () {
    process.env[key] = 'val1,val2,val3';
    expect(isArray(isPassthrough)(key)).to.deep.equal(['val1', 'val2', 'val3']);
  });

  it('should ignore whitespace around the words', function () {
    process.env[key] = '  val1 , val2  ';
    expect(isArray(isPassthrough)(key)).to.deep.equal(['val1', 'val2']);
  });

  it('should allow whitespace in the words', function () {
    process.env[key] = 'the val1,the val2';
    expect(isArray(isPassthrough)(key)).to.deep.equal(['the val1', 'the val2']);
  });

  it('should properly deserialize the elements', function () {
    process.env[key] = 'true,false,true';
    expect(isArray(isBoolean)(key)).to.deep.equal([true, false, true]);
  });
});
