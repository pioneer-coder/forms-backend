/* eslint-disable no-use-before-define */
import Bluebird from 'bluebird';
import Emittery from 'emittery';
import defaultLogger, { logWithCid } from '@/utils/logger/index.js';
import sentry from '@/interfaces/sentry/index.js';
import { AnyError, BaseFunction } from '@/typings/common.js';
import { ServerError } from '@/errors/index.js';
import deepSanitize from '@/utils/deepSanitize/index.js';

enum EVENTS {
  BASE_EVENT = 'base-event'
}

// Every class with events will need EVENT_PARAMS, passed in as a template to the class
// This enables type checking of params with the emit method
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type EVENT_PARAMS = {
  [EVENTS.BASE_EVENT]: void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ListenerFunction = ((args: any) => any);
export type TypedListenerFunction<
  EX extends BaseFunction,
  EPS,
  EV extends keyof EPS,
  R = EX extends void ? void : (Parameters<EX>[0] | null)
> = (
  props: EPS[EV]
) => R | Promise<R>

export type Listener = {
  service: BaseService<void>; // eslint-disable-line no-use-before-define
  [eventName: string | 'service']: BaseService<void> | ListenerFunction;
};

export type AddLogToParams<P extends Record<string, Record<string, unknown>>, Keys extends keyof P = keyof P> = {
  [K in Keys]: P[K];
};

// Services that will emit/listen for events should extend this class
class BaseService<EventParams extends Record<string, unknown> | void> {
  // Implement this property in subclasses with their event names
  public EVENTS: Record<string, string> | null = EVENTS;

  private emitter: Emittery;

  inProgressEmittedEvents: number;

  inProgressHandledEvents: number;

  // Overwrite this method in subclasses if your service will do something with the data
  // returned by its listeners - for an example, see the scheduled event service.
  async execute(_data: unknown): Promise<void> {
    // empty
  }

  async emit<T extends keyof EventParams, R extends EventParams[T]>(eventName: T, data: R): Promise<void> {
    const log = logWithCid();
    const debugData = deepSanitize(data);
    const start = Date.now();
    this.inProgressEmittedEvents += 1;
    log.info({ data: debugData, eventName, service: this.constructor.name }, 'event-emitted');
    await this.emitter.emit(this.fullEventName(eventName as string), data);
    const took = Date.now() - start;
    this.inProgressEmittedEvents -= 1;
    log.info({
      data: debugData,
      eventName,
      service: this.constructor.name,
      took,
    }, 'event-completed');
  }

  // @todo - This should have eventName: keyof EventParams (and no more eventName as string in other places...).
  // But this requires fixing the Listener typing, which is hard.
  fullEventName(eventName: string): string {
    return `${this.constructor.name}.${eventName}`;
  }

  on(eventName: string, listener: (...args: any[]) => void): this { // eslint-disable-line @typescript-eslint/no-explicit-any
    this.emitter.on(this.fullEventName(eventName), listener);
    return this;
  }

  addEventListeners({ service, ...listeners }: Listener): void {
    Object.keys(listeners).forEach((eventName) => {
      const loggerMeta = { emittingService: service?.constructor.name, eventName, listeningService: this.constructor.name };
      defaultLogger.info(loggerMeta, 'event-listener-added');
      service?.on(eventName, async (args) => {
        const log = logWithCid();
        const start = Date.now();
        this.inProgressHandledEvents += 1;
        try {
          log.info(loggerMeta, 'event-heard');
          const data = await (listeners[eventName] as ListenerFunction)(args);
          if (data) {
            await this.execute(data);
          }
          const took = Date.now() - start;
          log.info({ ...loggerMeta, took }, 'event-completed');
        } catch (error) {
          const took = Date.now() - start;
          log.info({ ...loggerMeta, took }, 'event-handler-failed');
          log.error(Object.assign(error as AnyError, loggerMeta), 'event-handler-error');
          sentry.captureException(error);
        }
        this.inProgressHandledEvents -= 1;
      });
    });
  }

  removeAllListeners(): void {
    this.emitter.clearListeners();
  }

  async gracefulShutdown(delay: number = 2 * 1000): Promise<void> {
    defaultLogger.info({ service: this.constructor.name }, 'graceful-shutdown-starting');
    await Bluebird.delay(delay);
    if (this.inProgressEmittedEvents > 0) {
      sentry.captureException(new ServerError('Failed to complete all emitted events', {
        inProgressEmittedEvents: this.inProgressEmittedEvents,
        service: this.constructor.name,
      }));
      defaultLogger.error({ inProgressEmittedEvents: this.inProgressEmittedEvents, service: this.constructor.name }, 'graceful-shutdown-unfinished-events');
    }
    if (this.inProgressHandledEvents > 0) {
      sentry.captureException(new ServerError('Failed to complete all heard events', {
        inProgressHandledEvents: this.inProgressHandledEvents,
        service: this.constructor.name,
      }));
      defaultLogger.error({ inProgressHandledEvents: this.inProgressHandledEvents, service: this.constructor.name }, 'graceful-shutdown-unfinished-handlers');
    }
    defaultLogger.info({ service: this.constructor.name }, 'graceful-shutdown-done');
  }

  constructor() {
    this.emitter = new Emittery();
    this.inProgressEmittedEvents = 0;
    this.inProgressHandledEvents = 0;
    defaultLogger.info({ service: this.constructor.name }, 'Initializing');
  }
}

export default BaseService;
