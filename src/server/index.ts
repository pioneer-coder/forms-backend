import configuration from '@/configuration/index.js';
import logger from '@/utils/logger/index.js';
import postgresDataSource from '@/dbs/typeorm/index.js';
import app from '@/app/index.js';
// import '@/services/listeners/index.js';
import sentry from '@/interfaces/sentry/index.js';
import gracefullyShutdown from './gracefulShutdown.js';

logger.info('App is starting!');

const server = app.listen(configuration.PORT, () => {
  logger.info(`API server is listening on port ${configuration.PORT}!`);
});

// all servers use the same ALB so this must match between the two.
// This must be smaller than the task definition deregistration delay
const AWS_ALB_IDLE_TIMEOUT = 5 * 60; // in seconds
// Ensure all inactive connections are terminated by the ALB,
// by setting this a few seconds higher than the ALB idle timeout (60 sec at the moment)
server.keepAliveTimeout = (AWS_ALB_IDLE_TIMEOUT + 1) * 1000; // in milliseconds
// Ensure the headersTimeout is set higher than the keepAliveTimeout due to this nodejs regression bug: https://github.com/nodejs/node/issues/27363
server.headersTimeout = (AWS_ALB_IDLE_TIMEOUT + 2) * 1000; // in milliseconds

if (postgresDataSource) {
  postgresDataSource
    .initialize()
    .then(() => {
      logger.info('Postgres/typeorm is up an running');
    })
    .catch((error: Error) => {
      logger.error(error, 'postgres-initialize-error');
      throw error;
    });
}

gracefullyShutdown(
  () => server.close((error) => {
    if (error) {
      logger.error(error, 'shutting down api server');
    }
    logger.info(`API server is no longer listening on port ${configuration.PORT}!`);
  }),
);

gracefullyShutdown(
  async () => {
    logger.info('Stopping services');
    await Promise.all([
    ])
      .catch((error) => sentry.captureException(error));
  },
);
/*
gracefullyShutdown(
  // @todo - remove postgresDataSource && when pg deployed to all tiers
  () => postgresDataSource && postgresDataSource.destroy()
    .then(() => {
      logger.info('Postgres/typeorm is stopped');
    })
    .catch((error) => {
      logger.error(error, 'shutting down postgres');
    }),
);
*/
gracefullyShutdown(
  async () => {
    logger.info('Flushing sentry');
    await sentry.gracefulShutdown(2 * 1000);
  },
);
