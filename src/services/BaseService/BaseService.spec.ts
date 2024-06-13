// eslint-disable-next-line max-classes-per-file
import sinon from 'sinon';
import { expect } from 'chai';
import Bluebird from 'bluebird';
import sentry from '@/interfaces/sentry/index.js';
import log from '@/utils/logger/index.js';
import { getDoubleArgs } from '@test/index.js';
import BaseService from './index.js';

enum Service1Events {
  TEST_EVENT = 'test-event'
}

enum Service2Events {
  TEST_EVENT_2 = 'test-event-2'
}

type Service1Params = {
  [Service1Events.TEST_EVENT]: unknown;
};

type Service2Params = {
  [Service2Events.TEST_EVENT_2]: unknown;
}

class Service1 extends BaseService<Service1Params> {
  public EVENTS = Service1Events;
}

const service1Instance = new Service1();

const listenerFunctions = {
  service2Listener: () => { /* empty */ },
  service3Listener: () => { /* empty */ },
};

class Service2 extends BaseService<Service2Params> {
  public EVENTS = Service2Events;

  handleTestEvent(): void { listenerFunctions.service2Listener(); }
}

const service2Instance = new Service2();

class Service3 extends BaseService<Service2Params> {
  public EVENTS = Service2Events;

  handleTestEvent(): void {
    listenerFunctions.service3Listener();
  }
}

const service3Instance = new Service3();

describe('services/BaseService', function () {
  beforeEach(function () {
    service1Instance.removeAllListeners();
    service2Instance.removeAllListeners();
    service3Instance.removeAllListeners();
  });

  it('Should receive events', async function () {
    service2Instance.addEventListeners({
      service: service1Instance,
      [service1Instance.EVENTS.TEST_EVENT]: service2Instance.handleTestEvent,
    });

    sinon.spy(listenerFunctions, 'service2Listener');
    await service1Instance.emit(service1Instance.EVENTS.TEST_EVENT, { log });
    expect(listenerFunctions.service2Listener).to.have.been.calledOnce;
  });

  it('Should call other listeners if one fails', async function () {
    service2Instance.addEventListeners({
      service: service1Instance,
      [service1Instance.EVENTS.TEST_EVENT]: service2Instance.handleTestEvent,
    });
    service3Instance.addEventListeners({
      service: service1Instance,
      [service1Instance.EVENTS.TEST_EVENT]: service3Instance.handleTestEvent,
    });

    sinon.stub(listenerFunctions, 'service2Listener').throws(new Error('Test error'));
    sinon.stub(listenerFunctions, 'service3Listener');
    sinon.spy(sentry, 'captureException');
    await service1Instance.emit(service1Instance.EVENTS.TEST_EVENT, { log });
    expect(listenerFunctions.service2Listener).to.have.been.calledOnce;
    expect(listenerFunctions.service3Listener).to.have.been.calledOnce;
    expect(sentry.captureException).to.have.been.calledOnce;
  });

  it('should return a promise for the all of the listeners', async function () {
    const service = new Service1();
    service.on(service.EVENTS.TEST_EVENT, async () => Bluebird.delay(100));
    const promise = service.emit(service.EVENTS.TEST_EVENT, { log });
    expect(promise).to.be.an.instanceOf(Promise);
    let isResolved = false;
    const promise2 = promise.then(() => { isResolved = true; });
    expect(isResolved).to.equal(false);
    await Bluebird.delay(50);
    expect(isResolved).to.equal(false);
    await promise2;
    expect(isResolved).to.equal(true);
  });

  it('should be able to remove all listeners', function () {
    const service = new Service1();
    service.on(service.EVENTS.TEST_EVENT, () => null);
    expect(service['emitter'].listenerCount()).to.equal(1);
    service.removeAllListeners();
    expect(service['emitter'].listenerCount()).to.equal(0);
  });

  it('Should count the inprogress emits', async function () {
    const service1 = new Service1();
    const service2 = new Service2();
    service2.addEventListeners({
      service: service1,
      [service1.EVENTS.TEST_EVENT]: () => Bluebird.delay(10),
    });
    service2.addEventListeners({
      service: service1,
      [service1.EVENTS.TEST_EVENT]: () => Bluebird.delay(10),
    });

    const promise = service1.emit(service1.EVENTS.TEST_EVENT, { log });
    await Bluebird.delay(5);
    expect(service1.inProgressEmittedEvents).to.equal(1);
    await promise;
    expect(service1.inProgressEmittedEvents).to.equal(0);
  });

  it('Should count handled inprogress events', async function () {
    const service1 = new Service1();
    const service2 = new Service2();
    service2.addEventListeners({
      service: service1,
      [service1.EVENTS.TEST_EVENT]: () => Bluebird.delay(10),
    });
    service2.addEventListeners({
      service: service1,
      [service1.EVENTS.TEST_EVENT]: () => Bluebird.delay(10),
    });

    const promise = service1.emit(service1.EVENTS.TEST_EVENT, { log });
    await Bluebird.delay(5);
    expect(service2.inProgressHandledEvents).to.equal(2);
    await promise;
    expect(service2.inProgressHandledEvents).to.equal(0);
  });

  it('should log a message if an emitted event is still pending when the graceful shutdown delay times out', async function () {
    const service1 = new Service1();
    const service2 = new Service2();
    service2.addEventListeners({
      service: service1,
      [service1.EVENTS.TEST_EVENT]: () => Bluebird.delay(10),
    });

    const promise = service1.emit(service1.EVENTS.TEST_EVENT, { log });

    await service1.gracefulShutdown(1);
    expect(log.error).to.have.been.called;
    const args = getDoubleArgs(log.error, { call: 1 });
    expect(args).to.deep.equal([
      {
        inProgressEmittedEvents: 1,
        service: 'Service1',
      },
      'graceful-shutdown-unfinished-events',
    ]);
    await promise;
  });

  it('should log a message if a handler is still pending when the graceful shutdown delay times out', async function () {
    const service1 = new Service1();
    const service2 = new Service2();
    service2.addEventListeners({
      service: service1,
      [service1.EVENTS.TEST_EVENT]: () => Bluebird.delay(10),
    });

    const promise = service1.emit(service1.EVENTS.TEST_EVENT, { log });

    await service2.gracefulShutdown(1);
    expect(log.error).to.have.been.called;
    const args = getDoubleArgs(log.error, { call: 1 });
    expect(args).to.deep.equal([
      {
        inProgressHandledEvents: 1,
        service: 'Service2',
      },
      'graceful-shutdown-unfinished-handlers',
    ]);
    await promise;
  });
});
