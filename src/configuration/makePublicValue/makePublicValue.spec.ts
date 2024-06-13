import { expect } from 'chai';
import makePublicValue from './index.js';

describe('configuration/makePublicValue', function () {
  it('should return the entire string if it is public', function () {
    expect(makePublicValue('some-string', { isPublic: true })).to.equal('some-string');
  });

  it('should only show the last 3 characters if it is not public', function () {
    expect(makePublicValue('some-string', { isPublic: false })).to.equal('***ing');
  });

  it('should default to not public', function () {
    expect(makePublicValue('some-string')).to.equal('***ing');
  });

  it('should show "***" for short non-public configs', function () {
    expect(makePublicValue('abc')).to.equal('***');
  });

  it('should stringify an object', function () {
    expect(makePublicValue({ hello: { world: 'world' } }, { isPublic: true })).to.equal('{"hello":{"world":"world"}}');
  });

  it('should not show any details of non-public stringified objects', function () {
    expect(makePublicValue({ hello: { world: 'world' } }, { isPublic: false })).to.equal('{}');
  });

  it('should stringify public numbers', function () {
    expect(makePublicValue(3 * 60 * 60, { isPublic: true })).to.equal('10800');
  });

  it('should stringify and obfuscate non-public numbers', function () {
    expect(makePublicValue(3 * 60 * 60, { isPublic: false })).to.equal('***800');
  });
});
