import { expect } from 'chai';
import isString from './index.js';
import { backupEnv, restoreEnv } from '../testUtils.js';

const key = 'A_KEY';
describe('configuration/isString', function () {
  before(function () {
    backupEnv(key);
  });

  afterEach(function () {
    restoreEnv();
  });

  it('should just use a string', function () {
    process.env[key] = 'some-string';
    expect(isString(key)).to.equal('some-string');
  });

  it('should return the defaultValue if not defined', function () {
    delete process.env[key];
    expect(isString(key, { defaultValue: 'the-default' })).to.equal('the-default');
  });

  it('should return the defaultValue if ""', function () {
    process.env[key] = '';
    expect(isString(key, { defaultValue: 'the-default' })).to.equal('the-default');
  });

  it('should return null if not defined and not required', function () {
    delete process.env[key];
    expect(isString(key, { isRequired: false })).to.equal(null);
  });

  it('should return null if "" and not required', function () {
    process.env[key] = '';
    expect(isString(key, { isRequired: false })).to.equal(null);
  });

  it('should throw an error if it is not defined and isRequired', function () {
    delete process.env[key];
    expect(() => isString(key, { isRequired: true })).to.throw('Missing value for constant: A_KEY.');
  });

  it('should throw an error if it is "" and isRequired', function () {
    process.env[key] = '';
    expect(() => isString(key, { isRequired: true })).to.throw('Missing value for constant: A_KEY.');
  });

  it('should default to being required', function () {
    delete process.env[key];
    expect(() => isString(key)).to.throw('Missing value for constant: A_KEY.');
  });
});
