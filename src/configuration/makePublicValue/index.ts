// eslint-disable-next-line @typescript-eslint/no-explicit-any
const valueToString = (value: any): string => {
  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (typeof value.toString === 'function') {
    const asString = value.toString();
    if (asString !== '[object Object]') {
      return asString;
    }
  }

  return JSON.stringify(value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makePublicValue = (value: any, options: { isPublic?: boolean } = {}): string => {
  const asString = valueToString(value);
  if (options.isPublic) {
    return asString;
  }

  if (asString === 'null' || asString === 'undefined') {
    return asString;
  }

  if (asString === '[object Object]' || asString === '{}' || typeof value === 'object') {
    return '{}';
  }

  if (asString.length <= 3) {
    return '***';
  }

  return `***${asString.slice(-3)}`;
};

export default makePublicValue;
