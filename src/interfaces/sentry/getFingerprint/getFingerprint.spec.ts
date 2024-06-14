import { expect } from 'chai';

import {
  BadRequestError, ForbiddenError, ServerError, UnauthorizedError,
} from '@/errors/index.js';

import getFingerprint from './index.js';

describe('interfaces/sentry/getFingerprint', function () {
  it('should return null (ie default/stack) for a ServerError', function () {
    const error = new ServerError('oops');
    expect(getFingerprint({ error })).to.be.null;
  });

  it('should return null (ie default/stack) for a plain Error', function () {
    const error = new Error('oops');
    expect(getFingerprint({ error })).to.be.null;
  });

  it('should set the fingerprint to the transaction for UnauthorizedError http errors', function () {
    const error = new UnauthorizedError('Nope, I do not know who you are');
    const event = {
      contexts: {},
    };
    expect(getFingerprint({ error, event })).to.deep.equal(['Unauthorized', '{{ transaction }}']);
  });

  it('should set the fingerprint to the transaction for ForbiddenError http errors', function () {
    const error = new ForbiddenError('Nope, not you are not allowed to do this');
    const event = {
      contexts: {},
    };
    expect(getFingerprint({ error, event })).to.deep.equal(['Forbidden', '{{ transaction }}']);
  });

  it('should use the transaction for all other handled errors', function () {
    const error = new BadRequestError('Oops');
    const event = {
      contexts: {},
    };
    expect(getFingerprint({ error, event })).to.deep.equal(['{{ transaction }}', '{{ stack }}']);
  });
});
