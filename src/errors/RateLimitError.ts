/* eslint-disable class-methods-use-this */

import ServerError from './ServerError.js';

export default class RateLimitError extends ServerError {
  constructor() {
    super('Too many requests.');
  }

  get responseMessage(): ServerError['responseMessage'] { return this.message; }

  get statusCode(): ServerError['statusCode'] { return 429; }
}
