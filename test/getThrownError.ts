const getThrownError = (fn: () => unknown): Error | void => {
  try {
    fn();
    return undefined;
  } catch (error) {
    return error as Error;
  }
};

const getAsyncThrownError = async (pr: Promise<unknown>): Promise<Error | void> => pr
  .then(() => undefined)
  .catch((error) => error as Error);

export default getThrownError;
export { getAsyncThrownError };
