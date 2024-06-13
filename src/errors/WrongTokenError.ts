/* eslint-disable class-methods-use-this */

import ServerError from './ServerError.js';

export default class WrongTokenError extends ServerError {
  constructor({ id }: { id?: string } = {}) {
    super('Wrong token.', { id });
  }

  get responseMessage(): ServerError['responseMessage'] { return this.message; }

  get statusCode(): ServerError['statusCode'] { return 409; }
}
