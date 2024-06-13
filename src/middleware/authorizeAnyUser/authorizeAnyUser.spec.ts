import { expect } from 'chai';
import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';

import { UnauthorizedError } from '@/errors/index.js';
import authorizeAnyUser from './index.js';

describe('middleware/authorizeAnyUser', function () {
  beforeEach(function () {
    this.anonymousUser = {
      id: '234234',
      isAnonymous: true,
      role: 'customer',
    };
    this.verifiedUser = {
      id: '345345',
      isAnonymous: false,
      role: 'customer',
    };
  });

  it('should call next with nothing if there is valid user', function () {
    const req = {
      user: this.verifiedUser,
    } as Request;
    const res = {} as Response;
    const next = sinon.spy();
    authorizeAnyUser(req, res, next as NextFunction);
    expect(next).to.have.been.calledOnce;
    const err = next.getCall(0).args[0];
    expect(err).to.equal(undefined);
  });

  it('should call next with Unauthorized if the user if anonymous', function () {
    const req = {
      user: this.anonymousUser,
    } as Request;
    const res = {} as Response;
    const next = sinon.spy();
    authorizeAnyUser(req, res, next as NextFunction);
    expect(next).to.have.been.calledOnce;
    const err = next.getCall(0).args[0];
    expect(err).to.be.an.instanceOf(UnauthorizedError);
  });

  it('should call next with Unauthorized if there is no user', function () {
    const req = {} as Request;
    const res = {} as Response;
    const next = sinon.spy();
    authorizeAnyUser(req, res, next as NextFunction);
    expect(next).to.have.been.calledOnce;
    const err = next.getCall(0).args[0];
    expect(err).to.be.an.instanceOf(UnauthorizedError);
  });
});
