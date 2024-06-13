import authService from '@/services/auth/index.js';
import Roles from '@/typings/Roles.js';
import { AnyError } from '@/typings/common.js';

const doit = async (): Promise<void> => {
  const personId = process.argv[2];

  if (!personId) {
    throw new Error('No personId');
  }

  const token = await authService.generateJWT({
    isOnBehalfOf: true,
    person: {
      id: personId,
      role: Roles.Customer,
    },
  });
  console.log(`created session for: ${personId}`);
  console.log(`token: ${token}`);
};

Promise.resolve()
  .then(doit)
  .catch((err: AnyError): void => {
    console.log(`-E- ${err.stack}`);
    process.exit(1);
  });
