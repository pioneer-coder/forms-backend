/* eslint-disable class-methods-use-this */

import ServerError from './ServerError.js';

export default class UnauthorizedError extends ServerError {
  constructor(message?: string) {
    super(message || 'Unauthorized');
  }

  get responseMessage(): ServerError['responseMessage'] { return this.message; }

  get statusCode(): ServerError['statusCode'] { return 401; }
}
