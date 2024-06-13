import { expect } from 'chai';
import { makePaginatedResponse } from './index.js';

const defaultRequest = {
  items: [],
  numItems: 100,
  page: 1,
  perPage: 10,
};

describe('api/helpers/pagination/makePaginatedResponse', function () {
  it('should just pass the items through', function () {
    const items = Array(10).fill(null);
    const response = makePaginatedResponse({ ...defaultRequest, items });
    expect(response.items).to.equal(items);
  });

  it('should just pass the numItems through', function () {
    const numItems = 124;
    const response = makePaginatedResponse({ ...defaultRequest, numItems });
    expect(response.numItems).to.equal(numItems);
  });

  it('should just pass the page through', function () {
    const page = 12;
    const response = makePaginatedResponse({ ...defaultRequest, page });
    expect(response.page).to.equal(page);
  });

  it('should just pass the perPage through', function () {
    const perPage = 12;
    const response = makePaginatedResponse({ ...defaultRequest, perPage });
    expect(response.perPage).to.equal(perPage);
  });

  it('should calculate the number of pages', function () {
    const perPage = 12;
    const numItems = 711;
    const response = makePaginatedResponse({ ...defaultRequest, numItems, perPage });
    expect(response.numPages).to.equal(60); // 59.25 round up
  });
});
