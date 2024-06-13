import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import _ from 'lodash';
import configuration from '@/configuration/index.js';
import { ReqUser, Roles } from '@/typings/common.js';

const { JWT_SIGNING_SECRET, JWT_SIGNING_SECRET_PREVIOUS } = configuration;

class AuthService {
  async generateJWT({ isAnonymous = false, isOnBehalfOf, person }: {
    isAnonymous?: boolean;
    isOnBehalfOf?: boolean;
    person: {
      id: string;
      role: Roles;
    };
  }): Promise<string> {
    const payload = {
      id: person.id,
      isAdmin: person.role === Roles.Admin,
      isAnonymous,
      isComplete: true,
      isCreator: person.role === Roles.Creator,
      isOnBehalfOf,
      role: person.role,
    };

    // @todo - check payload if isOnBehalfOf is false
    return jsonwebtoken.sign(payload, JWT_SIGNING_SECRET, {
      expiresIn: '60 days',
    });
  }

  private verifyJWTWithSecret({ token, secret }: { token: string, secret: string }): ReqUser {
    const decoded = jsonwebtoken.verify(token, secret) as JwtPayload & {
      id: string;
      role: Roles;
      email: string;
    };
    return {
      exp: decoded.exp || Date.now(),
      id: decoded.id,
      isAdmin: decoded.isAdmin ?? (decoded.role === Roles.Admin),
      isAnonymous: decoded.isAnonymous ?? false,
      isComplete: decoded.isComplete ?? false,
      isCreator: decoded.isCreator ?? (decoded.role === Roles.Creator),
      isOnBehalfOf: decoded.isOnBehalfOf ?? false,
    };
  }

  verifyAuthToken({ token }: { token: string }): ReqUser {
    try {
      return this.verifyJWTWithSecret({ secret: JWT_SIGNING_SECRET, token });
    } catch (err) {
      try {
        return this.verifyJWTWithSecret({ secret: JWT_SIGNING_SECRET_PREVIOUS, token });
      } catch (err2) { /* ignore error */ }
      // throw the error from the current secret.
      throw err;
    }
  }
}

const authService = new AuthService();
export default authService;
