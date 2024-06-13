import ServerError from './ServerError.js';

export default class UploadError extends ServerError {
  private msg: string;

  constructor(msg: string, error?: string) {
    super('Upload error');
    this.msg = msg;
    this.details = { originalError: error };
  }

  get errors(): ServerError['errors'] {
    return null;
  }

  get responseMessage(): ServerError['responseMessage'] { return this.msg; }

  get statusCode(): ServerError['statusCode'] { return 400; }
}
