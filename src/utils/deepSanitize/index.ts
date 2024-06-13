const DEPTH_LIMIT = 7;
const SECRET_KEYS = [
  'password',
];

type Traversable = Record<string, unknown> | unknown[];

const isSecretKey = (key: string): boolean => SECRET_KEYS.includes(key.toLowerCase());
const isAnObject = (thing: unknown): thing is Record<string, unknown> => typeof thing === 'object';

function deepSanitize(originalThing: unknown): unknown {
  const visited: Traversable[] = [];

  const hasVisited = (thing: Traversable): boolean => {
    if (visited.includes(thing)) {
      return true;
    }
    visited.push(thing);
    return false;
  };

  const deepSanitizeWork = (thing: unknown, depth: number): unknown => {
    if (depth > DEPTH_LIMIT) {
      return '[DEPTH-LIMIT-REACHED]';
    }

    if (thing instanceof Error || thing === null || thing === undefined) {
      return thing;
    }

    if (Array.isArray(thing)) {
      if (hasVisited(thing)) {
        return '[CIRCULAR]';
      }
      return thing.map((t) => deepSanitizeWork(t, depth + 1));
    }

    if (Buffer.isBuffer(thing)) {
      return '[BUFFER]';
    }

    if (isAnObject(thing)) {
      if (hasVisited(thing)) {
        return '[CIRCULAR]';
      }
      const newThing: Record<string, unknown> = {};
      Object.keys(thing).forEach((k) => {
        newThing[k] = isSecretKey(k)
          ? '[SECRET-HIDDEN]'
          : deepSanitizeWork(thing[k], depth + 1);
      });

      return newThing;
    }

    if (typeof thing === 'string') {
      return thing.replace(/\n/g, '<newline>');
    }

    if (typeof thing === 'function') {
      const fnName = thing.name;
      return fnName ? `function ${fnName}` : 'function';
    }

    return thing;
  };

  return deepSanitizeWork(originalThing, 0);
}

type Wrapper = typeof deepSanitize & { default: typeof deepSanitize };

const deepSanitizeWrapped: Wrapper = (...args) => deepSanitizeWrapped.default(...args);

deepSanitizeWrapped.default = deepSanitize;

export default deepSanitizeWrapped;
