import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import sentry from '@/interfaces/sentry/index.js';
import { getDoubleArgs } from '@test/index.js';
import clientVersion, { HEADER_KEY } from './index.js';

describe('middleware/clientVersion', function () {
  it('should call next', function () {
    const next = sinon.spy();
    const res = {} as unknown as Response;
    const req = {} as Request;
    clientVersion(req, res, next);
    expect(next).to.have.been.calledOnce;
  });

  it('should set the client version in sentry', function () {
    sinon.spy(sentry, 'setClientVersion');
    const thisClientVersion = 'forced-to-be-this';
    const next = sinon.spy();
    const res = { } as unknown as Response;
    const req = {
      headers: {
        [HEADER_KEY]: thisClientVersion,
      },
    } as unknown as Request;
    clientVersion(req, res, next);
    expect(sentry.setClientVersion).to.have.been.calledOnce;
    const args = getDoubleArgs(sentry.setClientVersion)[0];
    expect(args).to.deep.equal(thisClientVersion);
  });

  it('should not try to set the client version if it is not in the header', function () {
    sinon.spy(sentry, 'setClientVersion');
    const next = sinon.spy();
    const res = {} as unknown as Response;
    const req = {} as Request;
    clientVersion(req, res, next);
    expect(sentry.setClientVersion).not.to.have.been.called;
  });
});
