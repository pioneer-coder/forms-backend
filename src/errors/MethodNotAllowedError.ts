/* eslint-disable class-methods-use-this */

import type { AllowedMethod } from '@/typings/api.js';
import ServerError from './ServerError.js';

type Response = ServerError['response'] & {
  allowedMethods: string[];
};

export default class MethodNotAllowedError extends ServerError {
  private allowedMethods: AllowedMethod[];

  private thisMethod: AllowedMethod;

  constructor(thisMethod: AllowedMethod, allowedMethods: AllowedMethod[]) {
    super('Method Not Allowed');
    this.allowedMethods = allowedMethods;
    this.thisMethod = thisMethod;
  }

  get statusCode(): ServerError['statusCode'] { return 405; }

  get response(): Response {
    return {
      allowedMethods: this.allowedMethods,
      errors: [`Attempted to make a ${this.thisMethod} request`],
      message: 'Method Not Allowed',
      statusCode: this.statusCode,
      type: this.type,
    };
  }
}
