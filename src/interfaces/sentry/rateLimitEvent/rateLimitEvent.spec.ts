import { expect } from 'chai';
import sinon from 'sinon';

import * as cache from './cache.js';
import rateLimitEvent from './index.js';

describe('interfaces/sentry/rateLimitEvent', function () {
  beforeEach(function () {
    cache.clear();
  });

  it('should not rate limit the first one', function () {
    const event = {
      transaction: 'GET /some/path',
    };
    expect(rateLimitEvent(event)).to.equal(false);
  });

  it('should not rate limit the 500th event', function () {
    const event = {
      transaction: 'GET /some/path',
    };
    for (let index = 0; index < 500 - 1; index += 1) {
      cache.add(event);
    }
    expect(rateLimitEvent(event)).to.equal(false);
  });

  it('should rate limit the 501st event', function () {
    const event = {
      transaction: 'GET /some/path',
    };
    for (let index = 0; index < 501 - 1; index += 1) {
      cache.add(event);
    }
    expect(rateLimitEvent(event)).to.equal(true);
  });

  it('should not rate limit the 501st event, if it was more than a day from the first one', function () {
    const event = {
      transaction: 'GET /some/path',
    };
    const dateFirst = Date.now();
    for (let index = 0; index < 501 - 1; index += 1) {
      cache.add(event);
    }
    sinon.stub(Date, 'now').returns(dateFirst + 24 * 60 * 60 * 1000 + 1000);
    expect(rateLimitEvent(event)).to.equal(false);
  });

  it('should not rate limit the 501st event if it had a different transaction', function () {
    const event1 = {
      transaction: 'GET /some/path',
    };
    for (let index = 0; index < 501 - 1; index += 1) {
      cache.add(event1);
    }
    const event2 = {
      transaction: 'GET /some/other-path',
    };
    expect(rateLimitEvent(event2)).to.equal(false);
  });
});
