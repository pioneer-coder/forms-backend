import { expect } from 'chai';
import { z } from 'zod';

import { ServerError } from '@/errors/index.js';
import { getThrownError } from '@test/index.js';
import buildConfiguration from './buildConfiguration.js';

const key = 'SOME_KEY';

describe('configuration/buildConfiguration', function () {
  describe('string', function () {
    it('should get the string', function () {
      const configuration = buildConfiguration(
        { [key]: 'some value' },
        { [key]: z.string() },
      );
      expect(configuration[key]).to.equal('some value');
    });

    it('should use the real value even if a default is given', function () {
      const configuration = buildConfiguration(
        { [key]: 'some value' },
        { [key]: z.string().default('default value') },
      );
      expect(configuration[key]).to.equal('some value');
    });

    it('should use the default if no value is given', function () {
      const configuration = buildConfiguration(
        {},
        { [key]: z.string().default('default value') },
      );
      expect(configuration[key]).to.equal('default value');
    });

    it('should use the default if the value is ""', function () {
      const configuration = buildConfiguration(
        { [key]: '' },
        { [key]: z.string().default('default value') },
      );
      expect(configuration[key]).to.equal('default value');
    });

    it('should throw an error if the value is not set and it is not nullable and has no defult', function () {
      const error = getThrownError(() => buildConfiguration(
        { [key]: '' },
        { [key]: z.string() },
      ));
      expect(error).to.be.an.instanceOf(ServerError);
      expect((error as ServerError).message).to.equal('Failed to build configuration: SOME_KEY');
    });

    it('should return undefined if the value is not set and it is not nullable and has no defult, but is optional', function () {
      const configuration = buildConfiguration(
        {},
        { [key]: z.string().optional() },
      );
      expect(configuration[key]).to.be.undefined;
    });

    it('should return null if the value is not set and it is not nullable and has no defult, but is nullable', function () {
      const configuration = buildConfiguration(
        { [key]: null },
        { [key]: z.string().nullable() },
      );
      expect(configuration[key]).to.be.null;
    });

    it('should get the array of strings', function () {
      const configuration = buildConfiguration(
        { [key]: 'some value  ,  other value' },
        { [key]: z.string().array() },
      );
      expect(configuration[key]).to.deep.equal(['some value', 'other value']);
    });

    it('should get the array of strings, even if there is only one item', function () {
      const configuration = buildConfiguration(
        { [key]: 'some value' },
        { [key]: z.string().array() },
      );
      expect(configuration[key]).to.deep.equal(['some value']);
    });

    it('should handle z.array(z.string()) as well as the chained version', function () {
      const configuration = buildConfiguration(
        { [key]: 'some value' },
        { [key]: z.array(z.string()) },
      );
      expect(configuration[key]).to.deep.equal(['some value']);
    });

    it('should throw an error if the array is empty and not optional', function () {
      const error = getThrownError(() => buildConfiguration(
        { [key]: '' },
        { [key]: z.string().array() },
      ));
      expect(error).to.be.an.instanceOf(ServerError);
      expect((error as ServerError).message).to.equal('Failed to build configuration: SOME_KEY');
    });

    it('should not throw an error if the array is empty but is optional', function () {
      const error = getThrownError(() => buildConfiguration(
        { [key]: '' },
        { [key]: z.string().array().optional() },
      ));
      expect(error).to.be.undefined;
    });
  });

  describe('number', function () {
    it('should get the number', function () {
      const configuration = buildConfiguration(
        { [key]: '10' },
        { [key]: z.number() },
      );
      expect(configuration[key]).to.equal(10);
    });

    it('should get the float', function () {
      const configuration = buildConfiguration(
        { [key]: '10.2' },
        { [key]: z.number() },
      );
      expect(configuration[key]).to.equal(10.2);
    });

    it('should use the real value even if a default is given', function () {
      const configuration = buildConfiguration(
        { [key]: '1' },
        { [key]: z.number().default(30) },
      );
      expect(configuration[key]).to.equal(1);
    });

    it('should use the default if no value is given', function () {
      const configuration = buildConfiguration(
        {},
        { [key]: z.number().default(30) },
      );
      expect(configuration[key]).to.equal(30);
    });

    it('should use the default if the value is ""', function () {
      const configuration = buildConfiguration(
        { [key]: '' },
        { [key]: z.number().default(45) },
      );
      expect(configuration[key]).to.equal(45);
    });

    it('should throw an error if the value is not set and it is not nullable and has no defult', function () {
      const error = getThrownError(() => buildConfiguration(
        { [key]: '' },
        { [key]: z.number() },
      ));
      expect(error).to.be.an.instanceOf(ServerError);
      expect((error as ServerError).message).to.equal('Failed to build configuration: SOME_KEY');
    });

    it('should return undefined if the value is not set and it is not nullable and has no defult, but is optional', function () {
      const configuration = buildConfiguration(
        {},
        { [key]: z.number().optional() },
      );
      expect(configuration[key]).to.be.undefined;
    });

    it('should get the array of number', function () {
      const configuration = buildConfiguration(
        { [key]: '1.1,2' },
        { [key]: z.number().array() },
      );
      expect(configuration[key]).to.deep.equal([1.1, 2]);
    });

    it('should get the array of numbers, even if there is only one item', function () {
      const configuration = buildConfiguration(
        { [key]: '4' },
        { [key]: z.number().array() },
      );
      expect(configuration[key]).to.deep.equal([4]);
    });

    it('should throw an error if the array is empty and not optional', function () {
      const error = getThrownError(() => buildConfiguration(
        { [key]: '' },
        { [key]: z.number().array() },
      ));
      expect(error).to.be.an.instanceOf(ServerError);
      expect((error as ServerError).message).to.equal('Failed to build configuration: SOME_KEY');
    });

    it('should not throw an error if the array is empty but is optional', function () {
      const error = getThrownError(() => buildConfiguration(
        { [key]: '' },
        { [key]: z.number().array().optional() },
      ));
      expect(error).to.be.undefined;
    });

    it('should error if a float is given when an integer is expected', function () {
      const error = getThrownError(() => buildConfiguration(
        { [key]: '10.2' },
        { [key]: z.number().int() },
      ));
      expect(error).to.be.an.instanceOf(ServerError);
      expect((error as ServerError).message).to.equal('Failed to build configuration: SOME_KEY');
      expect((error as ServerError).details).to.deep.equal({
        issues: [
          {
            code: 'invalid_type',
            expected: 'integer',
            message: 'Expected integer, received float',
            path: [],
            received: 'float',
          },
        ],
      });
    });
  });

  describe('boolean', function () {
    it('should handle "true"', function () {
      const configuration = buildConfiguration(
        { [key]: 'true' },
        { [key]: z.boolean() },
      );
      expect(configuration[key]).to.be.true;
    });

    it('should handle "false"', function () {
      const configuration = buildConfiguration(
        { [key]: 'false' },
        { [key]: z.boolean() },
      );
      expect(configuration[key]).to.be.false;
    });

    it('should use the real value even if a default is given', function () {
      const configuration = buildConfiguration(
        { [key]: 'true' },
        { [key]: z.boolean().default(false) },
      );
      expect(configuration[key]).to.be.true;
    });

    it('should use the false default if no value is given', function () {
      const configuration = buildConfiguration(
        {},
        { [key]: z.boolean().default(false) },
      );
      expect(configuration[key]).to.be.false;
    });

    it('should use the true default if no value is given', function () {
      const configuration = buildConfiguration(
        {},
        { [key]: z.boolean().default(true) },
      );
      expect(configuration[key]).to.be.true;
    });

    it('should use the false default if the value is ""', function () {
      const configuration = buildConfiguration(
        { [key]: '' },
        { [key]: z.boolean().default(false) },
      );
      expect(configuration[key]).to.be.false;
    });

    it('should use the true default if the value is ""', function () {
      const configuration = buildConfiguration(
        { [key]: '' },
        { [key]: z.boolean().default(true) },
      );
      expect(configuration[key]).to.be.true;
    });

    it('should throw an error if the value is not set and it is not nullable and has no defult', function () {
      const error = getThrownError(() => buildConfiguration(
        { [key]: '' },
        { [key]: z.boolean() },
      ));
      expect(error).to.be.an.instanceOf(ServerError);
      expect((error as ServerError).message).to.equal('Failed to build configuration: SOME_KEY');
    });

    it('should return undefined if the value is not set and it is not nullable and has no defult, but is optional', function () {
      const configuration = buildConfiguration(
        {},
        { [key]: z.boolean().optional() },
      );
      expect(configuration[key]).to.be.undefined;
    });

    it('should get the array of number', function () {
      const configuration = buildConfiguration(
        { [key]: 'true,false' },
        { [key]: z.boolean().array() },
      );
      expect(configuration[key]).to.deep.equal([true, false]);
    });

    it('should get the array of booleans, even if there is only one item', function () {
      const configuration = buildConfiguration(
        { [key]: 'true' },
        { [key]: z.boolean().array() },
      );
      expect(configuration[key]).to.deep.equal([true]);
    });

    it('should throw an error if the array is empty and not optional', function () {
      const error = getThrownError(() => buildConfiguration(
        { [key]: '' },
        { [key]: z.boolean().array() },
      ));
      expect(error).to.be.an.instanceOf(ServerError);
      expect((error as ServerError).message).to.equal('Failed to build configuration: SOME_KEY');
    });

    it('should not throw an error if the array is empty but is optional', function () {
      const error = getThrownError(() => buildConfiguration(
        { [key]: '' },
        { [key]: z.boolean().array().optional() },
      ));
      expect(error).to.be.undefined;
    });
  });
});
