import { expect } from 'chai';

import configuration from '@/configuration/index.js';
import { ForbiddenError, RateLimitError } from '@/errors/index.js';

import ignoreError from './index.js';

describe('interfaces/sentry/ignoreErrors', function () {
  it('should not ignore a regular Error', function () {
    expect(ignoreError({ error: new Error('No message'), event: {} })).to.be.false;
  });

  it('should ignore RateLimitError\'s"', function () {
    expect(ignoreError({ error: new RateLimitError(), event: {} })).to.be.true;
  });

  it('should ignore events from a development client, if this is the production server', function () {
    configuration.SENTRY_ENVIRONMENT = 'production';
    const clientVersion = 'development@noodle-frontend@0.0.0';
    expect(ignoreError({ error: new Error('oops'), event: { tags: { clientVersion } } })).to.be.true;
  });

  it('should ignore events from a development client, if this is the qa server', function () {
    configuration.SENTRY_ENVIRONMENT = 'qa';
    const clientVersion = 'development@noodle-frontend@0.0.0';
    expect(ignoreError({ error: new Error('oops'), event: { tags: { clientVersion } } })).to.be.true;
  });

  it('should not ignore events from a development client, if this is the development server', function () {
    configuration.SENTRY_ENVIRONMENT = 'development';
    const clientVersion = 'development@noodle-frontend@0.0.0';
    expect(ignoreError({ error: new Error('oops'), event: { tags: { clientVersion } } })).to.be.false;
  });

  it('should ignore events from a qa client, if this is the production server', function () {
    configuration.SENTRY_ENVIRONMENT = 'production';
    const clientVersion = 'qa@noodle-frontend@0.0.0';
    expect(ignoreError({ error: new Error('oops'), event: { tags: { clientVersion } } })).to.be.true;
  });

  it('should not ignore events from a qa client, if this is the qa server', function () {
    configuration.SENTRY_ENVIRONMENT = 'qa';
    const clientVersion = 'qa@noodle-frontend@0.0.0';
    expect(ignoreError({ error: new Error('oops'), event: { tags: { clientVersion } } })).to.be.false;
  });

  it('should not ignore events from a production client, if this is the production server', function () {
    configuration.SENTRY_ENVIRONMENT = 'production';
    const clientVersion = 'production@noodle-frontend@0.0.0';
    expect(ignoreError({ error: new Error('oops'), event: { tags: { clientVersion } } })).to.be.false;
  });

  it('should not ignore events an unknown client', function () {
    configuration.SENTRY_ENVIRONMENT = 'production';
    const clientVersion = undefined;
    expect(ignoreError({ error: new Error('oops'), event: { tags: { clientVersion } } })).to.be.false;
  });

  it('should ignore Forbidden errors, if the user is "onBehalfOf" (ie dummy number)', function () {
    expect(ignoreError({ error: new ForbiddenError('oops'), event: { tags: { isOnBehalfOf: true } } })).to.be.true;
  });

  it('should not ignore Forbidden errors, if the user is not "onBehalfOf"', function () {
    expect(ignoreError({ error: new ForbiddenError('oops'), event: { tags: { isOnBehalfOf: false } } })).to.be.false;
  });
});
