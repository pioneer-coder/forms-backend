/* eslint-disable class-methods-use-this */

import ServerError from '../ServerError.js';

type CheckObject = Record<string, unknown>;
type Response = ServerError['response'] & {
  missingFields: string[];
};

const isNotSet = (item: unknown): boolean => item === undefined || item === null || item === '';
const isSet = (item: unknown): boolean => !isNotSet(item);

const getMissingProps = (obj: CheckObject): string[] => {
  const keys = Object.keys(obj);
  return keys.filter((k) => isNotSet(obj[k])).sort();
};

export default class MissingRequiredFieldsError extends ServerError {
  missingFields: string[];

  constructor(...missingFields: string[]) {
    super('Missing required fields');
    this.missingFields = missingFields;
  }

  get statusCode(): ServerError['statusCode'] { return 400; }

  get response(): Response {
    return {
      errors: this.missingFields.map((f) => `Missing ${f}`),
      message: 'Missing required fields',
      missingFields: this.missingFields,
      statusCode: this.statusCode,
      type: this.type,
    };
  }

  static fromObject(obj: CheckObject): MissingRequiredFieldsError {
    const missing = getMissingProps(obj);
    return new MissingRequiredFieldsError(...missing);
  }

  static checkAndThrow(obj: CheckObject): void {
    const missing = getMissingProps(obj);
    if (missing.length > 0) {
      throw new MissingRequiredFieldsError(...missing);
    }
  }

  static exactlyOne(obj: CheckObject): unknown | undefined {
    const keys = Object.keys(obj);
    const areSet = keys.filter((k) => isSet(obj[k])).sort();
    if (areSet.length === 1) {
      return obj[areSet[0]];
    }
    return undefined;
  }
}
