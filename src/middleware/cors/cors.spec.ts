/* eslint-disable no-useless-escape */
import { expect } from 'chai';
import parseOriginList from './parseOriginList.js';

describe('middleware/cors', function () {
  describe('.parseOriginList', function () {
    it('should include strings', function () {
      expect(parseOriginList(['http://example.com'])).to.deep.equal(['http://example.com']);
    });

    it('should convert "/example\.com$/" to a RegExp', function () {
      const [re] = parseOriginList(['/example\.com$/']);
      expect(re).to.be.an.instanceOf(RegExp);
      expect(re.toString()).to.equal('/example\.com$/');
    });
  });
});
