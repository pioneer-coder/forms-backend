import { NextFunction, Response, Request } from 'express';
import sinon, { SinonSpy } from 'sinon';
import { expect } from 'chai';
import { nanoid } from 'nanoid';
import { BadRequestError, UnauthorizedError } from '@/errors/index.js';
import deepSanitize from '@/utils/deepSanitize/index.js';
import { getDoubleArgs, fixtures } from '@test/index.js';
import errorHandler from './index.js';

const { log } = fixtures;
describe('middleware/errorHandler', function () {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let sendFake: SinonSpy;
  let statusFake: SinonSpy;

  beforeEach(function () {
    sendFake = sinon.fake();
    statusFake = sinon.fake.returns({
      json: sendFake,
    });
    req = {
      cid: nanoid(),
    } as unknown as Request;
    res = {
      status: statusFake,
    } as unknown as Response;
    next = sinon.spy() as NextFunction;
  });

  it('should not call next', function () {
    const err = new Error('Oops');
    errorHandler(err, req, res, next);
    expect(next).not.to.have.been.called;
  });

  it('should set the response status to be the status code of the error', function () {
    const err = new UnauthorizedError();
    errorHandler(err, req, res, next);
    expect(statusFake).to.have.been.calledOnce;
    expect(statusFake).to.have.been.calledWith(401);
  });

  it('should use 500 for errors with defined statusCode', function () {
    const err = new Error('Oops');
    errorHandler(err, req, res, next);
    expect(statusFake).to.have.been.calledOnce;
    expect(statusFake).to.have.been.calledWith(500);
  });

  it('should respond with the errors "response"', function () {
    const err = new UnauthorizedError();
    errorHandler(err, req, res, next);
    expect(sendFake).to.have.been.calledOnce;
    expect(sendFake).to.have.been.calledWith({
      correlationId: req.cid,
      message: 'Unauthorized',
      statusCode: 401,
      type: 'UnauthorizedError',
    });
  });

  it('should log the error', function () {
    const err = new UnauthorizedError();
    errorHandler(err, req, res, next);
    expect(log.error).to.have.been.calledOnce;
    const args = getDoubleArgs(log.error);
    expect(args[0]).to.shallowDeepEqual({
      err: {
        message: 'Unauthorized',
        reason: 'Unknown',
        statusCode: 401,
        type: 'UnauthorizedError',
      },
    });
    expect(args[1]).to.equal('Returned Error');
  });

  it('should log the error\'s server only data', function () {
    const err = new BadRequestError('some error');
    errorHandler(err, req, res, next);
    expect(log.error).to.have.been.calledOnce;
    const args = getDoubleArgs(log.error);
    expect(args[0]).to.deep.equal({
      err: {
        message: 'some error',
        reason: 'Unknown',
        stack: err.stack,
        statusCode: 400,
        type: 'BadRequestError',
      },
    });
  });

  it('should log the original error, if it needed to be converted', function () {
    const err = new Error('Oops');
    errorHandler(err, req, res, next);
    expect(log.error).to.have.been.calledTwice;
    const args = getDoubleArgs(log.error);
    expect(args).to.deep.equal([err, 'Original Error']);
  });

  it('should log the converted error, with the original message and stack', function () {
    const err = new Error('Oops');
    errorHandler(err, req, res, next);
    expect(log.error).to.have.been.calledTwice;
    const args = getDoubleArgs(log.error, { call: 2 });
    expect((args[0] as any).err.message).to.equal(err.message);
    expect((args[0] as any).err.stack).to.equal(err.stack);
    expect(args[1]).to.equal('Returned Error');
  });

  it('should log the request body', function () {
    req.body = { hello: 'world' };
    const err = new Error('Oops');
    errorHandler(err, req, res, next);
    expect(log.error).to.have.been.calledThrice;
    const args = getDoubleArgs(log.error, { call: 3 });
    expect(args).to.deep.equal([{ body: req.body }, 'failedRequestsBody']);
  });

  it('should remove sensitive information from the logged body', function () {
    req.body = { hello: 'world' };
    const err = new Error('Oops');
    sinon.spy(deepSanitize, 'default');
    errorHandler(err, req, res, next);
    expect(deepSanitize.default).to.have.been.calledOnce;
    const args = (deepSanitize.default as unknown as SinonSpy).getCall(0).args[0];
    expect(args).to.deep.equal(req.body);
  });
});
