/* eslint-disable class-methods-use-this */

import ServerError from './ServerError.js';

export default class UnloadablePdfError extends ServerError {
  constructor(document: { id: string }) {
    super('Unloadable PDF', { documentId: document.id });
  }

  get errors(): ServerError['errors'] {
    return [this.message];
  }

  get responseMessage(): ServerError['responseMessage'] { return 'UnloadablePdf'; }

  get statusCode(): ServerError['statusCode'] { return 400; }
}
