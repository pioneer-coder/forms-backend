import { expect } from 'chai';
import isInteger from './index.js';
import { backupEnv, restoreEnv } from '../testUtils.js';

const key = 'A_KEY';
describe('configuration/isInteger', function () {
  before(function () {
    backupEnv(key);
  });

  afterEach(function () {
    restoreEnv();
  });

  it('should cast "10" correctly', function () {
    process.env[key] = '10';
    expect(isInteger(key)).to.equal(10);
  });

  it('should cast "10" correctly, even with a defaultValue', function () {
    process.env[key] = '10';
    expect(isInteger(key, { defaultValue: 99 })).to.equal(10);
  });

  it('should cast "10.1" correctly', function () {
    process.env[key] = '10.1';
    expect(isInteger(key)).to.equal(10);
  });

  it('should cast "10a" correctly', function () {
    process.env[key] = '10a';
    expect(isInteger(key)).to.equal(10);
  });

  it('should return the defaultValue if undefined', function () {
    delete process.env[key];
    expect(isInteger(key, { defaultValue: 99 })).to.equal(99);
  });

  it('should return the defaultValue if ""', function () {
    process.env[key] = '';
    expect(isInteger(key, { defaultValue: 99 })).to.equal(99);
  });

  it('should return null if not defined and not required', function () {
    delete process.env[key];
    expect(isInteger(key, { isRequired: false })).to.equal(null);
  });

  it('should return null if "" and not required', function () {
    process.env[key] = '';
    expect(isInteger(key, { isRequired: false })).to.equal(null);
  });

  it('should throw an error if it is not defined and isRequired', function () {
    delete process.env[key];
    expect(() => isInteger(key, { isRequired: true })).to.throw('Missing value for constant: A_KEY.');
  });

  it('should throw an error if it "" and isRequired', function () {
    process.env[key] = '';
    expect(() => isInteger(key, { isRequired: true })).to.throw('Missing value for constant: A_KEY.');
  });

  it('should default to being required', function () {
    delete process.env[key];
    expect(() => isInteger(key)).to.throw('Missing value for constant: A_KEY.');
  });

  it('should throw an error if the value is NaN', function () {
    process.env[key] = 'foo';
    expect(() => isInteger(key)).to.throw('Bad value for constant: A_KEY (foo).');
  });
});
