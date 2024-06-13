/* eslint-disable class-methods-use-this */

import ServerError from './ServerError.js';

const DEFAULT_MESSAGE = 'Not Found';
export default class NotFoundError extends ServerError {
  constructor(message?: string, details?: ServerError['details']) {
    super(message || DEFAULT_MESSAGE, details);
  }

  get errors(): ServerError['errors'] {
    return this.message === DEFAULT_MESSAGE ? null : [this.message];
  }

  get responseMessage(): ServerError['responseMessage'] { return DEFAULT_MESSAGE; }

  get statusCode(): ServerError['statusCode'] { return 404; }
}
