/* eslint-disable class-methods-use-this */

import ServerError from './ServerError.js';

export default class ForbiddenError extends ServerError {
  constructor(message?: string) {
    const reason = message || 'Forbidden';
    super(reason);
    this.reason = reason;
  }

  get responseMessage(): ServerError['responseMessage'] { return this.message; }

  get statusCode(): ServerError['statusCode'] { return 403; }
}
