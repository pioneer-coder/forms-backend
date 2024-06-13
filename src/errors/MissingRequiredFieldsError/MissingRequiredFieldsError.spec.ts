import { expect } from 'chai';
import { getThrownError } from '@test/index.js';
import MissingRequiredFieldsError from './index.js';

describe('errors/MissingRequiredFieldsError', function () {
  describe('.checkAndThrow', function () {
    it('should not throw if the object is empty', function () {
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({}));
      expect(error).to.equal(undefined);
    });

    it('should not throw if the object if all the keys have values', function () {
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ hello: 'world' }));
      expect(error).to.equal(undefined);
    });

    it('should throw an error if the value is undefined', function () {
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ hello: undefined }));
      expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
      expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['hello']);
    });

    it('should throw an error if the value is null', function () {
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ hello: null }));
      expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
      expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['hello']);
    });

    it('should throw an error if the value is ""', function () {
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ hello: '' }));
      expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
      expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['hello']);
    });

    it('should not throw an error if the value is false', function () {
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ hello: false }));
      expect(error).to.equal(undefined);
    });

    it('should not throw an error if the value is 0', function () {
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ hello: 0 }));
      expect(error).to.equal(undefined);
    });

    it('should throw an error if any value is undefined', function () {
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ foo: undefined, hello: 'world' }));
      expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
      expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['foo']);
    });

    it('should throw an error with all of the missing fields', function () {
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ bar: null, foo: undefined, hello: 'world' }));
      expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
      expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['bar', 'foo']);
    });

    it('should not throw on deep props existing', function () {
      const where = { id: '1' };
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ 'where.id': where?.id }));
      expect(error).to.equal(undefined);
    });

    it('should error on missing deep props', function () {
      const where: { id?: string } = {};
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ 'where.id': where?.id }));
      expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
      expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['where.id']);
    });

    it('should not throw if only id is present when id || slug', function () {
      const id: string | undefined = '1';
      const slug: string | undefined = undefined;
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ 'id || slug': id || slug }));
      expect(error).to.equal(undefined);
    });

    it('should not throw if only slug is present when id || slug', function () {
      const id: string | undefined = undefined;
      const slug: string | undefined = 'the-slug';
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ 'id || slug': id || slug }));
      expect(error).to.equal(undefined);
    });

    it('should not throw if both slug and id are present when id || slug', function () {
      const id: string | undefined = '1';
      const slug: string | undefined = 'the-slug';
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ 'id || slug': id || slug }));
      expect(error).to.equal(undefined);
    });

    it('should error if neither the slug nor id are present when id || slug', function () {
      const id: string | undefined = undefined;
      const slug: string | undefined = undefined;
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ 'id || slug': id || slug }));
      expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
      expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['id || slug']);
    });

    it('should error if both the slug and id are present when both id and slug are defined, and exactlyOne is used', function () {
      const id: string | undefined = '1';
      const slug: string | undefined = 'the-slug';
      const error = getThrownError(() => MissingRequiredFieldsError.checkAndThrow({ 'exactly on of id or slug': MissingRequiredFieldsError.exactlyOne({ id, slug }) }));
      expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
      expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['exactly on of id or slug']);
    });
  });

  describe('.fromObject', function () {
    it('should return an error, not throw, if there are no missing props', function () {
      const error = MissingRequiredFieldsError.fromObject({ hello: undefined });
      expect(error).to.be.instanceOf(MissingRequiredFieldsError);
      expect(error.response.missingFields).deep.equal(['hello']);
    });

    it('should return an error even if there are no missing props', function () {
      const error = MissingRequiredFieldsError.fromObject({ hello: 'world' });
      expect(error).to.be.instanceOf(MissingRequiredFieldsError);
      expect(error.response.missingFields).deep.equal([]);
    });
  });
});
