import { expect } from 'chai';
import isBoolean from './index.js';
import { backupEnv, restoreEnv } from '../testUtils.js';

const key = 'A_KEY';

describe('configuration/isBoolean', function () {
  before(function () {
    backupEnv(key);
  });

  afterEach(function () {
    restoreEnv();
  });

  it('should cast "true" correctly', function () {
    process.env[key] = 'true';
    expect(isBoolean(key)).to.equal(true);
  });

  it('should be case-insensitive', function () {
    process.env[key] = 'TrUe';
    expect(isBoolean(key)).to.equal(true);
  });

  it('should cast "false" correctly', function () {
    process.env[key] = 'false';
    expect(isBoolean(key)).to.equal(false);
  });

  it('should return the defaultValue if ubdefined', function () {
    delete process.env[key];
    expect(isBoolean(key, { defaultValue: true })).to.equal(true);
  });

  it('should return the defaultValue if ""', function () {
    process.env[key] = '';
    expect(isBoolean(key, { defaultValue: true })).to.equal(true);
  });

  it('should return null if not defined and not required', function () {
    delete process.env[key];
    expect(isBoolean(key, { isRequired: false })).to.equal(null);
  });

  it('should return null if "" and not required', function () {
    process.env[key] = '';
    expect(isBoolean(key, { isRequired: false })).to.equal(null);
  });

  it('should throw an error if it is not defined and isRequired', function () {
    delete process.env[key];
    expect(() => isBoolean(key, { isRequired: true })).to.throw('Missing value for constant: A_KEY.');
  });

  it('should throw an error if it "" and isRequired', function () {
    process.env[key] = '';
    expect(() => isBoolean(key, { isRequired: true })).to.throw('Missing value for constant: A_KEY.');
  });

  it('should default to being required', function () {
    delete process.env[key];
    expect(() => isBoolean(key)).to.throw('Missing value for constant: A_KEY.');
  });

  it('should throw an error if the value is not "true" or "false"', function () {
    process.env[key] = 'foo';
    expect(() => isBoolean(key)).to.throw('Bad value for constant: A_KEY (foo).');
  });
});
