import { pino } from 'pino';

const logger = pino(); // can't use @/utils/logger because of circular dependencies

/* eslint-disable class-methods-use-this */
type Details = Record<string, unknown> | string | string [];

export type Response = {
  details?: Details;
  statusCode: number;
  type: string;
  message: string;
  errors?: string[];
};

export default class ServerError extends Error {
  details?: Details;

  reason = 'Unknown';

  constructor(message?: string, details?: Details) {
    super(message || 'Internal Server Error');
    if (details) {
      this.details = details;
    }
  }

  get errors(): string[] | null {
    if (this.message === this.responseMessage) {
      return null;
    }
    return [this.message];
  }

  get responseMessage(): string { return 'Internal Server Error'; }

  get statusCode(): number { return 500; }

  get type(): string { return this.constructor.name; }

  get response(): Response {
    const response: Response = {
      message: this.responseMessage,
      statusCode: this.statusCode,
      type: this.type,
    };
    if (this.errors) {
      response.errors = this.errors;
    }
    if (this.details) {
      response.details = this.details;
    }
    return response;
  }

  toLog(): Record<string, unknown> {
    return {
      message: this.message,
      reason: this.reason,
      stack: this.stack,
      statusCode: this.statusCode,
      type: this.type,
    };
  }

  static asServerError(err: unknown): ServerError {
    if (err instanceof ServerError) {
      return err;
    }

    if (err instanceof Error) {
      const asServerError = new ServerError(err.message);
      asServerError.stack = err.stack;
      return asServerError;
    }

    logger.error(err, 'got non-Error in asServerError');
    if (typeof err === 'string') {
      const asServerError = new ServerError(err);
      return asServerError;
    }

    const asServerError = new ServerError('Unknown');
    return asServerError;
  }
}
