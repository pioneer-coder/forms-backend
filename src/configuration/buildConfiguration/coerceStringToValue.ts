/* eslint-disable no-underscore-dangle */
import { z } from 'zod';
import { ServerError } from '../../errors/index.js';

const coerceStringToValue = <T extends z.ZodTypeAny>(value: string | undefined | null, schema: T): z.infer<T> | undefined => {
  const definition = schema._def;
  const { typeName } = definition;

  if (typeName === z.ZodFirstPartyTypeKind.ZodNullable) {
    if (value === null || value === undefined || value === '') {
      return null;
    }
  } else if (value === null || value === undefined || value === '') {
    return undefined;
  }

  switch (typeName) {
    case z.ZodFirstPartyTypeKind.ZodString: {
      return value;
    }

    case z.ZodFirstPartyTypeKind.ZodNumber: {
      const asNumber = Number(value);
      if (Number.isNaN(asNumber)) {
        throw new ServerError('Is not a number', { value });
      }
      return asNumber;
    }

    case z.ZodFirstPartyTypeKind.ZodBoolean: {
      if (typeof value === 'string') {
        switch (value) {
          case 'true':
          case 'yes':
          case '1': {
            return true;
          }
          case 'false':
          case 'no':
          case '0': {
            return false;
          }
          default:
            throw new ServerError('Is not a boolean', { value });
        }
      }
      throw new ServerError('Is not a boolean', { value });
    }

    case z.ZodFirstPartyTypeKind.ZodDate: {
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value;
      }
      throw new ServerError('Invalid date', { value });
    }

    case z.ZodFirstPartyTypeKind.ZodOptional:
    case z.ZodFirstPartyTypeKind.ZodNullable:
    case z.ZodFirstPartyTypeKind.ZodDefault: {
      if (schema._def && 'innerType' in schema._def && schema._def.innerType) {
        return coerceStringToValue(value, schema._def.innerType);
      }
      throw new ServerError(`No innerType on ${typeName}`, { schema });
    }

    case z.ZodFirstPartyTypeKind.ZodArray: {
      const parts = value.split(',').map((s) => s.trim());
      return parts.map((s) => coerceStringToValue(s, schema._def.type));
    }

    // case z.ZodFirstPartyTypeKind.ZodAny:
    // case z.ZodFirstPartyTypeKind.ZodBigInt:
    // case z.ZodFirstPartyTypeKind.ZodEffects:
    // case z.ZodFirstPartyTypeKind.ZodEnum:
    // case z.ZodFirstPartyTypeKind.ZodFunction:
    // case z.ZodFirstPartyTypeKind.ZodIntersection:
    // case z.ZodFirstPartyTypeKind.ZodLazy:
    // case z.ZodFirstPartyTypeKind.ZodLiteral:
    // case z.ZodFirstPartyTypeKind.ZodMap:
    // case z.ZodFirstPartyTypeKind.ZodNaN:
    // case z.ZodFirstPartyTypeKind.ZodNativeEnum:
    // case z.ZodFirstPartyTypeKind.ZodNever:
    // case z.ZodFirstPartyTypeKind.ZodNull:
    // case z.ZodFirstPartyTypeKind.ZodObject:
    // case z.ZodFirstPartyTypeKind.ZodPromise:
    // case z.ZodFirstPartyTypeKind.ZodRecord:
    // case z.ZodFirstPartyTypeKind.ZodSet:
    // case z.ZodFirstPartyTypeKind.ZodTuple:
    // case z.ZodFirstPartyTypeKind.ZodUndefined:
    // case z.ZodFirstPartyTypeKind.ZodUnion:
    // case z.ZodFirstPartyTypeKind.ZodUnknown:
    // case z.ZodFirstPartyTypeKind.ZodVoid:
    default: {
      throw new ServerError(`Zod type not supported: ${typeName}`);
    }
  }
};

export default coerceStringToValue;
