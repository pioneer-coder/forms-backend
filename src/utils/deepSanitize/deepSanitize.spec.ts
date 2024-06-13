import { expect } from 'chai';
import deepSanitize from './index.js';

describe('utils/deepSanitize', function () {
  it('should just return a string', function () {
    const thing = 'a-string';
    expect(deepSanitize(thing)).to.equal(thing);
  });

  it('should just return a number', function () {
    const thing = 10;
    expect(deepSanitize(thing)).to.equal(thing);
  });

  it('should just return a null', function () {
    const thing = null;
    expect(deepSanitize(thing)).to.equal(null);
  });

  it('should just return a undefined', function () {
    const thing = undefined;
    expect(deepSanitize(thing)).to.equal(undefined);
  });

  it('should just return an array of strings and numbers', function () {
    const thing = [1, 'a', 2, 'b'];
    expect(deepSanitize(thing)).to.deep.equal(thing);
  });

  it('should just return a deep object with no secrets', function () {
    const thing = [1, 'a', {
      c: [{ d: 'd' }],
      e: 121,
    }];
    expect(deepSanitize(thing)).to.deep.equal(thing);
  });

  it('should remove "password"s', function () {
    const thing = { password: 'its-a-secret' };
    expect(deepSanitize(thing)).to.deep.equal({
      password: '[SECRET-HIDDEN]',
    });
  });

  it('should remove "password"s without touching other properies', function () {
    const thing = { notPassword: 'its-ok', password: 'its-a-secret' };
    expect(deepSanitize(thing)).to.deep.equal({
      notPassword: 'its-ok',
      password: '[SECRET-HIDDEN]',
    });
  });

  it('should remove "password" deeply', function () {
    const thing = {
      notPassword: 'its-ok',
      outer: [{ password: 'its-a-secret' }],
    };
    expect(deepSanitize(thing)).to.deep.equal({
      notPassword: 'its-ok',
      outer: [{ password: '[SECRET-HIDDEN]' }],
    });
  });

  it('should only go 7 deep', function () {
    const thing = {
      1: {
        2: [{
          3: {
            4: {
              5: {
                6: {
                  7: {
                    8: {},
                  },
                },
              },
            },
          },
        }],
      },
    };

    expect(deepSanitize(thing)).to.deep.equal({
      1: {
        2: [{
          3: {
            4: {
              5: {
                6: {
                  7: '[DEPTH-LIMIT-REACHED]',
                },
              },
            },
          },
        }],
      },
    });
  });

  it('should stop at circular objects', function () {
    const thing = {
      a: 'b',
      c: {},
    };
    thing.c = thing;

    expect(deepSanitize(thing)).to.deep.equal({
      a: 'b',
      c: '[CIRCULAR]',
    });
  });

  it('should stop at circular arrays', function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const thing: any[] = [];
    thing[0] = thing;

    expect(deepSanitize(thing)).to.deep.equal(['[CIRCULAR]']);
  });

  it('should remove new lines from text', function () {
    const thing = {
      lineWithNewLine: `it's
 on
 multiple
 lines`,
    };
    expect(deepSanitize(thing)).to.deep.equal({
      lineWithNewLine: 'it\'s<newline> on<newline> multiple<newline> lines',
    });
  });

  it('should say anonymous arrow functions are "function"', function () {
    expect(deepSanitize(() => undefined)).to.equal('function');
  });

  it('should say named arrow functions are "function name"', function () {
    const thing = (): undefined => undefined;
    expect(deepSanitize(thing)).to.equal('function thing');
  });

  it('should say anonymous functions are "function"', function () {
    expect(deepSanitize(() => undefined)).to.equal('function');
  });

  it('should say named, by the variable, functions are "function name"', function () {
    const thing = function (): void { /* */ };
    expect(deepSanitize(thing)).to.equal('function thing');
  });

  it('should say named functions are "function name"', function () {
    const thing = function thisFunction(): void { /* */ };
    expect(deepSanitize(thing)).to.equal('function thisFunction');
  });
});
