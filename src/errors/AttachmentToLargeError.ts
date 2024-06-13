/* eslint-disable class-methods-use-this */

import ServerError from './ServerError.js';

type Response = ServerError['response'] & {
  limit: number;
}
export default class AttachmentToLargeError extends ServerError {
  private limit: number; // in bytes

  constructor(message: string, limit: number) {
    super(message || 'Attachment is too large');
    this.limit = limit;
  }

  get statusCode(): ServerError['statusCode'] { return 413; }

  get response(): Response {
    return {
      limit: this.limit,
      message: this.message,
      statusCode: this.statusCode,
      type: this.type,
    };
  }
}
