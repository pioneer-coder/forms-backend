import { MissingRequiredFieldsError } from '@/errors/index.js';

const checkForMissingProps = (obj: Parameters<typeof MissingRequiredFieldsError.checkAndThrow>[0]): void => {
  MissingRequiredFieldsError.checkAndThrow(obj);
};

const { exactlyOne } = MissingRequiredFieldsError;

export default checkForMissingProps;
export { exactlyOne };
