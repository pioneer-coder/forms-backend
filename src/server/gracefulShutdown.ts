import process from 'node:process';
import logger from '@/utils/logger/index.js';

type ShutdownHandler = () => unknown;

const shutdownHandlers: ShutdownHandler[] = [];

process
  .on('SIGTERM', async () => {
    logger.info('Received SIGTERM');
    for (let i = 0; i < shutdownHandlers.length; i += 1) {
      const handler = shutdownHandlers[i];
      if (handler.name) {
        logger.info(`Gracefully shutting down: ${handler.name}`);
      }
      await handler(); // eslint-disable-line no-await-in-loop
    }
  })
  .on('exit', (code) => {
    logger.info(`About to exit with code: ${code}`);
  });

const addShutDownHandlers = (...handlers: ShutdownHandler[]): void => {
  shutdownHandlers.push(...handlers);
};

export default addShutDownHandlers;
