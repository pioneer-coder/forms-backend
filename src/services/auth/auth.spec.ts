import { expect } from 'chai';
import { nanoid } from 'nanoid';
import jsonwebtoken from 'jsonwebtoken';
import configuration from '@/configuration/index.js';
import authService from './index.js';

describe('services/auth', function () {
  describe('.verifyAuthToken', function () {
    it('should return the payload if the jwt is valid and signed with the correct secret', function () {
      const payload = {
        id: nanoid(),
        isAdmin: true,
        isComplete: true,
        isCreator: false,
        isOnBehalfOf: false,
      };
      const token = jsonwebtoken.sign(payload, configuration.JWT_SIGNING_SECRET);
      const decoded = authService.verifyAuthToken({ token });
      expect(decoded).to.shallowDeepEqual(payload);
    });

    it('should return the payload if the jwt is valid and signed with the previous secret', function () {
      const payload = {
        id: nanoid(),
        isAdmin: true,
        isComplete: true,
        isCreator: false,
        isOnBehalfOf: false,
      };
      const token = jsonwebtoken.sign(payload, configuration.JWT_SIGNING_SECRET_PREVIOUS);
      const decoded = authService.verifyAuthToken({ token });
      expect(decoded).to.shallowDeepEqual(payload);
    });

    it('should throw an error if the jwt can not be decoded', function () {
      const token = 'notatoken';
      expect(() => authService.verifyAuthToken({ token })).to.throw('jwt malformed');
    });

    it('should throw an error if the jwt was signed with a different key', function () {
      const payload = {
        id: nanoid(),
        isAdmin: true,
        isComplete: true,
        isCreator: false,
        isOnBehalfOf: false,
      };
      const token = jsonwebtoken.sign(payload, 'the wrong secret');
      expect(() => authService.verifyAuthToken({ token })).to.throw('invalid signature');
    });
  });
});
