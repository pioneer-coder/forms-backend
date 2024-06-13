import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import correlationId, { HEADER_KEY } from './index.js';

describe('middleware/correlationId', function () {
  it('should attach a cid', function () {
    const next = sinon.spy();
    const res = { set: () => undefined } as unknown as Response;
    const req = {} as Request;
    correlationId(req, res, next);
    expect(req.cid).to.be.ok;
  });

  it('should call next', function () {
    const next = sinon.spy();
    const res = { set: () => undefined } as unknown as Response;
    const req = {} as Request;
    correlationId(req, res, next);
    expect(next).to.have.been.calledOnce;
  });

  it('should set the header', function () {
    const next = sinon.spy();
    const setSpy = sinon.spy();
    const res = { set: setSpy } as unknown as Response;
    const req = {} as Request;
    correlationId(req, res, next);
    expect(setSpy).to.have.been.calledOnce;
    expect(setSpy.getCall(0).args).to.deep.equal([
      'x-correlationId',
      req.cid,
    ]);
  });

  it('should use the cid in the incoming requests header', function () {
    const thisCid = 'forced-to-be-this';
    const next = sinon.spy();
    const setSpy = sinon.spy();
    const res = { set: setSpy } as unknown as Response;
    const req = {
      headers: {
        [HEADER_KEY]: thisCid,
      },
    } as unknown as Request;
    correlationId(req, res, next);
    expect(req.cid).to.equal(thisCid);
    expect(setSpy).to.have.been.calledOnce;
    expect(setSpy.getCall(0).args).to.deep.equal([
      'x-correlationId',
      thisCid,
    ]);
  });
});
