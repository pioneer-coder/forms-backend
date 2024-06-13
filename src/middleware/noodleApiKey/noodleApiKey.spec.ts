import sinon from 'sinon';
import { NextFunction, Response, Request } from 'express';
import { expect } from 'chai';
import { ForbiddenError, UnauthorizedError } from '@/errors/index.js';
import apiKeysService from '@/services/apiKeys/index.js';
import { fixtures, getDoubleArgs } from '@test/index.js';

import noodleApiKey, { HEADER_KEY } from './index.js';

describe('middleware/noodleApiKey', function () {
  beforeEach(async function () {
    this.next = sinon.spy() as NextFunction;
    this.req = {
      headers: {},
    } as unknown as Request;
    this.apiKey = await fixtures.apiKey({ key: 'some-key', slug: 'this-one' });
  });

  it('should get the apiKey by the key in the header', async function () {
    this.req.headers[HEADER_KEY] = 'some-key';
    sinon.spy(apiKeysService, 'getByKey');
    await noodleApiKey('this-one')(this.req, {} as Response, this.next);
    expect(apiKeysService.getByKey).to.have.been.calledOnce;
    const args = getDoubleArgs(apiKeysService.getByKey)[0];
    expect(args).to.deep.equal({
      key: 'some-key',
    });
  });

  it('should call simply next if the correct key is in the header, with the correct slug', async function () {
    this.req.headers[HEADER_KEY] = 'some-key';
    await noodleApiKey('this-one')(this.req, {} as Response, this.next);
    expect(this.next).to.have.been.calledOnce;
    const args = getDoubleArgs(this.next);
    expect(args).to.be.an('array').with.length(0);
  });

  it('should call simply next if the correct key is in the header, with either of the slugs', async function () {
    this.req.headers[HEADER_KEY] = 'some-key';
    await noodleApiKey('also-ok-but-not-this-on', 'this-one')(this.req, {} as Response, this.next);
    expect(this.next).to.have.been.calledOnce;
    const args = getDoubleArgs(this.next);
    expect(args).to.be.an('array').with.length(0);
  });

  it('should call next with a Forbidden error if associated slug is not in the allowed ones', async function () {
    this.req.headers[HEADER_KEY] = 'some-key';
    await noodleApiKey('not-this-slug')(this.req, {} as Response, this.next);
    expect(this.next).to.have.been.calledOnce;
    const err = getDoubleArgs(this.next)[0];
    expect(err).to.be.instanceOf(ForbiddenError);
  });

  it('should call next with a Forbidden error if the key in the header is not in the DB', async function () {
    this.req.headers[HEADER_KEY] = 'the-wrong-key';
    await noodleApiKey('this-one')(this.req, {} as Response, this.next);
    expect(this.next).to.have.been.calledOnce;
    const err = getDoubleArgs(this.next)[0];
    expect(err).to.be.instanceOf(ForbiddenError);
  });

  it('should call next with an Unauthorized error if there is no key in the header', async function () {
    delete this.req.headers[HEADER_KEY];
    await noodleApiKey('this-one')(this.req, {} as Response, this.next);
    expect(this.next).to.have.been.calledOnce;
    const err = getDoubleArgs(this.next)[0];
    expect(err).to.be.instanceOf(UnauthorizedError);
  });
});
