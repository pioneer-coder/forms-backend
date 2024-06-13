import { expect } from 'chai';
import { NextFunction, Request, Response } from 'express';
import sinon from 'sinon';
import jsonwebtoken from 'jsonwebtoken';
import { nanoid } from 'nanoid';

import configuration from '@/configuration/index.js';
import { fixtures, getDoubleArgs } from '@test/index.js';
import authenticateUser from './index.js';

const { JsonWebTokenError } = jsonwebtoken;
type JsonWebTokenError = typeof JsonWebTokenError;

describe('middleware/authenticate', function () {
  beforeEach(function () {
    this.payload = {
      id: nanoid(),
      isAdmin: false,
      isComplete: false,
      isCreator: false,
      isOnBehalfOf: false,
    };
    this.next = sinon.spy() as NextFunction;
    this.res = {} as Response;
  });

  context('token in authorization header', function () {
    beforeEach(function () {
      this.token = jsonwebtoken.sign(this.payload, configuration.JWT_SIGNING_SECRET);
      this.req = {
        headers: {
          authorization: this.token,
        },
      } as Request;
    });
    it('should call next with nothing if the token, in the header, is valid', function () {
      authenticateUser(this.req, this.res, this.next);
      expect(this.next).to.have.been.calledOnce;
      const err = this.next.getCall(0).args[0];
      expect(err).to.equal(undefined);
    });

    it('should attach the user from the token in the header', function () {
      authenticateUser(this.req, this.res, this.next);
      expect(this.req.user).to.shallowDeepEqual(this.payload);
      expect(this.req.userData).to.shallowDeepEqual(this.payload);
    });
  });

  context('token attached to request', function () {
    beforeEach(function () {
      this.token = jsonwebtoken.sign(this.payload, configuration.JWT_SIGNING_SECRET);
      this.req = {
        token: this.token,
      } as Request;
    });
    it('should call next with nothing if the token, in the header, is valid', function () {
      authenticateUser(this.req, this.res, this.next);
      expect(this.next).to.have.been.calledOnce;
      const err = this.next.getCall(0).args[0];
      expect(err).to.equal(undefined);
    });

    it('should attach the user from the token in the header', function () {
      authenticateUser(this.req, this.res, this.next);
      expect(this.req.user).to.shallowDeepEqual(this.payload);
      expect(this.req.userData).to.shallowDeepEqual(this.payload);
    });
  });

  context('no token', function () {
    beforeEach(function () {
      this.req = {} as Request;
    });

    it('should call next with nothing if there is no token in the cookie or header', function () {
      authenticateUser(this.req, this.res, this.next);
      expect(this.next).to.have.been.calledOnce;
      const err = this.next.getCall(0).args[0];
      expect(err).to.equal(undefined);
    });

    it('should set req.user to null)', function () {
      authenticateUser(this.req, this.res, this.next);
      expect(this.req.user).to.equal(null);
      expect(this.req.userData).to.equal(null);
    });
  });

  it('should authenticate creators', function () {
    this.token = jsonwebtoken.sign(this.payload, configuration.JWT_SIGNING_SECRET);
    this.req = {
      headers: {
        authorization: this.token,
      },
    } as Request;
    authenticateUser(this.req, this.res, this.next);
    expect(this.req.user).to.shallowDeepEqual(this.payload);
    expect(this.req.userData).to.shallowDeepEqual(this.payload);
  });

  it('should authenticate customers', function () {
    this.token = jsonwebtoken.sign(this.payload, configuration.JWT_SIGNING_SECRET);
    this.req = {
      headers: {
        authorization: this.token,
      },
    } as Request;
    authenticateUser(this.req, this.res, this.next);
    expect(this.req.user).to.shallowDeepEqual(this.payload);
    expect(this.req.userData).to.shallowDeepEqual(this.payload);
  });

  context('forged token', function () {
    beforeEach(function () {
      this.token = jsonwebtoken.sign(this.payload, 'not-the-correct-secret');
      this.req = {
        headers: {
          authorization: this.token,
        },
        log: fixtures.log,
      } as unknown as Request;
    });

    it('should call next with nothing if token is not properly signed', function () {
      authenticateUser(this.req, this.res, this.next);
      expect(this.next).to.have.been.calledOnce;
      const err = this.next.getCall(0).args[0];
      expect(err).to.equal(undefined);
    });

    it('should set req.user to be null', function () {
      authenticateUser(this.req, this.res, this.next);
      expect(this.req.user).to.equal(null);
      expect(this.req.userData).to.equal(null);
    });

    it('should log the failed attempt to decode the token', function () {
      authenticateUser(this.req, this.res, this.next);
      expect(this.req.log.error).to.have.been.calledOnce;
      const args = getDoubleArgs(this.req.log.error);
      const error = args[0] as Error;
      expect(error).to.be.an.instanceof(JsonWebTokenError);
      expect(error.message).to.equal('invalid signature');
      expect(args[1]).to.equal('Failed to verify the token');
    });
  });
});
