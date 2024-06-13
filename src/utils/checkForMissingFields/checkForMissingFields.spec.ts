import { expect } from 'chai';
import { MissingRequiredFieldsError } from '@/errors/index.js';
import { getThrownError } from '@test/index.js';

import checkForMissingFields, { exactlyOne } from './index.js';

describe('utils/checkForMissingFields', function () {
  it('should not throw if the object is empty', function () {
    const error = getThrownError(() => checkForMissingFields({}));
    expect(error).to.equal(undefined);
  });

  it('should not throw if the object if all the keys have values', function () {
    const error = getThrownError(() => checkForMissingFields({ hello: 'world' }));
    expect(error).to.equal(undefined);
  });

  it('should throw an error if the value is undefined', function () {
    const error = getThrownError(() => checkForMissingFields({ hello: undefined }));
    expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
    expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['hello']);
  });

  it('should throw an error if the value is null', function () {
    const error = getThrownError(() => checkForMissingFields({ hello: null }));
    expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
    expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['hello']);
  });

  it('should throw an error if the value is ""', function () {
    const error = getThrownError(() => checkForMissingFields({ hello: '' }));
    expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
    expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['hello']);
  });

  it('should not throw an error if the value is false', function () {
    const error = getThrownError(() => checkForMissingFields({ hello: false }));
    expect(error).to.equal(undefined);
  });

  it('should not throw an error if the value is 0', function () {
    const error = getThrownError(() => checkForMissingFields({ hello: 0 }));
    expect(error).to.equal(undefined);
  });

  it('should throw an error if any value is undefined', function () {
    const error = getThrownError(() => checkForMissingFields({ foo: undefined, hello: 'world' }));
    expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
    expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['foo']);
  });

  it('should throw an error with all of the missing fields', function () {
    const error = getThrownError(() => checkForMissingFields({ bar: null, foo: undefined, hello: 'world' }));
    expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
    expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['bar', 'foo']);
  });

  it('should not throw on deep props existing', function () {
    const where = { id: '1' };
    const error = getThrownError(() => checkForMissingFields({ 'where.id': where?.id }));
    expect(error).to.equal(undefined);
  });

  it('should error on missing deep props', function () {
    const where: { id?: string } = {};
    const error = getThrownError(() => checkForMissingFields({ 'where.id': where?.id }));
    expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
    expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['where.id']);
  });

  it('should not throw if only id is present when id || slug', function () {
    const id: string | undefined = '1';
    const slug: string | undefined = undefined;
    const error = getThrownError(() => checkForMissingFields({ 'id || slug': id || slug }));
    expect(error).to.equal(undefined);
  });

  it('should not throw if only slug is present when id || slug', function () {
    const id: string | undefined = undefined;
    const slug: string | undefined = 'the-slug';
    const error = getThrownError(() => checkForMissingFields({ 'id || slug': id || slug }));
    expect(error).to.equal(undefined);
  });

  it('should not throw if both slug and id are present when id || slug', function () {
    const id: string | undefined = '1';
    const slug: string | undefined = 'the-slug';
    const error = getThrownError(() => checkForMissingFields({ 'id || slug': id || slug }));
    expect(error).to.equal(undefined);
  });

  it('should error if neither the slug nor id are present when id || slug', function () {
    const id: string | undefined = undefined;
    const slug: string | undefined = undefined;
    const error = getThrownError(() => checkForMissingFields({ 'id || slug': id || slug }));
    expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
    expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['id || slug']);
  });

  it('should error if both the slug and id are present when both id and slug are defined, and exactlyOne is used', function () {
    const id: string | undefined = '1';
    const slug: string | undefined = 'the-slug';
    const error = getThrownError(() => checkForMissingFields({ 'exactly on of id or slug': exactlyOne({ id, slug }) }));
    expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
    expect((error as MissingRequiredFieldsError).response.missingFields).to.deep.equal(['exactly on of id or slug']);
  });
});
