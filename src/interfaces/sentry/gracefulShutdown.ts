import * as Sentry from '@sentry/node';

const gracefulShutdown = async (timeout: number): Promise<void> => {
  await Sentry.close(timeout);
};

export default gracefulShutdown;
