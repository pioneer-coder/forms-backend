import { expect } from 'chai';
import deserializeQuery, { BuildOptions } from './index.js';

describe('utils/deserializeQuery', function () {
  context('typescript - BuildOptions', function () {
    // These are just testing the BuildOptions generic type.
    // This makes sure that the options passed into deserializeQuery match the expected response.
    // The expect isn't really testing anything, these are actually tested in check:build
    it('should convert optional strings', function () {
      const v: BuildOptions<{ aString?: string }> = { aString: { type: 'string' } };
      expect(v).to.be.ok;
    });
    it('should be ok with defaultValue: undefined on optional strings', function () {
      const v: BuildOptions<{ aString?: string }> = { aString: { defaultValue: undefined, type: 'string' } };
      expect(v).to.be.ok;
    });
    it('should say that required strings have a defaultValue', function () {
      const v: BuildOptions<{ aString: string }> = { aString: { defaultValue: 'def', type: 'string' } };
      expect(v).to.be.ok;
    });
    it('should work for numbers', function () {
      const v: BuildOptions<{ aNumber: number }> = { aNumber: { defaultValue: 2, type: 'integer' } };
      expect(v).to.be.ok;
    });
    it('should work for booleans', function () {
      const v: BuildOptions<{ aBoolean?: boolean }> = { aBoolean: { type: 'boolean' } };
      expect(v).to.be.ok;
    });
  });

  it('should just return an empty object with no params', function () {
    const deserialized = deserializeQuery({}, { foo: { type: 'string' } });
    expect(deserialized).to.deep.equal({});
  });

  it('should parse an object with a string', function () {
    const deserialized = deserializeQuery<{ foo?: string }>({ foo: 'bar' }, { foo: { type: 'string' } });
    expect(deserialized).to.deep.equal({ foo: 'bar' });
  });

  it('should remove things not in the options', function () {
    const deserialized = deserializeQuery({ not: 'there' }, { foo: { type: 'string' } });
    expect(deserialized).to.deep.equal({});
  });

  it('should use the defaultValue', function () {
    const deserialized = deserializeQuery({}, { foo: { defaultValue: 'default-value', type: 'string' } });
    expect(deserialized).to.deep.equal({ foo: 'default-value' });
  });

  it('should remove things that are undefined', function () {
    const deserialized = deserializeQuery({ foo: undefined }, { foo: { type: 'string' } });
    expect(deserialized).to.deep.equal({});
  });
});
