import { expect } from 'chai';
import getSkipPagination from './index.js';

describe('utils/getSkipPagination', function () {
  it('should work for page 1', function () {
    expect(getSkipPagination({ page: 1, perPage: 10 })).to.equal(0);
  });

  it('should work for page 2', function () {
    expect(getSkipPagination({ page: 2, perPage: 10 })).to.equal(10);
  });

  it('should work with a page size of 12', function () {
    expect(getSkipPagination({ page: 3, perPage: 12 })).to.equal(24);
  });

  it('should say page 0 is page 1', function () {
    expect(getSkipPagination({ page: 0, perPage: 10 })).to.equal(0);
  });

  it('should assume negative pages are 1', function () {
    expect(getSkipPagination({ page: -1, perPage: 10 })).to.equal(0);
  });

  it('should round off fractional pages', function () {
    expect(getSkipPagination({ page: 2.7, perPage: 10 })).to.equal(17);
  });

  it('should be ok-ish with a page size of 0', function () {
    expect(getSkipPagination({ page: 2, perPage: 0 })).to.equal(0);
  });

  it('should be ok-ish with a negative page size', function () {
    expect(getSkipPagination({ page: 2, perPage: -1 })).to.equal(0);
  });

  it('should round off fractional page sizes', function () {
    expect(getSkipPagination({ page: 2, perPage: 10.6 })).to.equal(11);
  });
});
