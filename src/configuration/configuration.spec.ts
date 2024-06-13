import { expect } from 'chai';
import configuration from './index.js';
import { Configuration } from './typings.js';

describe('configuration', function () {
  it('should let you override a configuration', function () {
    configuration.PORT = 8912;
    expect(configuration.PORT).to.equal(8912);
  });

  it('should restore the value', function () {
    expect(configuration.PORT).not.to.equal(8912);
  });

  it('should let you add a configuration key', function () {
    type WithHello = Configuration & { HELLO?: string };
    const c = configuration as WithHello;
    c.HELLO = 'world';
    expect(c.HELLO).to.equal('world');
  });

  it('should remove the added configuration key', function () {
    type WithHello = Configuration & { HELLO?: string };
    const c = configuration as WithHello;
    expect(c.HELLO).to.equal(undefined);
  });
});
