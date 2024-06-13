/* eslint-disable class-methods-use-this */

import ServerError from './ServerError.js';

export default class BadRequestError extends ServerError {
  constructor(message?: string, details?: ServerError['details']) {
    super(message || 'Bad Request', details);
  }

  get errors(): ServerError['errors'] {
    return this.message === 'Bad Request' ? null : [this.message];
  }

  get responseMessage(): ServerError['responseMessage'] { return 'BadRequest'; }

  get statusCode(): ServerError['statusCode'] { return 400; }
}
