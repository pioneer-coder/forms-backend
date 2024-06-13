const captureException = (_error: unknown, _extra?: Record<string, unknown>): void => {};
const setCorrelationId = (_str: string): void => {};
const setClientVersion = (_str: string): void => {};
const gracefulShutdown = (_n: number): void => {};
const setUser = (_user: { id: string | null | undefined, isOnBehalfOf: boolean }): void => {};

export default {
  captureException,
  gracefulShutdown,
  setClientVersion,
  setCorrelationId,
  setUser,
};
