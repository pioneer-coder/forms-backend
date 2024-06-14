import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import configuration from '@/configuration/index.js';
import { getCorrelationId } from '@/utils/correlationId/index.js';
import { logWithCid } from '@/utils/logger/index.js';

import getFingerprint from './getFingerprint/index.js';
import ignoreError from './ignoreError/index.js';
import pickSampleRate from './pickSampleRate/index.js';
import rateLimitEvent from './rateLimitEvent/index.js';

const environment = configuration.SENTRY_ENVIRONMENT;
const release = environment === 'production' ? `${configuration.PROJECT_NAME}@${configuration.VERSION}` : undefined;
const enabled = configuration.SENTRY_ENABLED;
const debug = configuration.SENTRY_DEBUG;
const dsn = configuration.SENTRY_DSN;

const initialize = (): void => {
  const logger = logWithCid();
  Sentry.init({
    beforeSend(event, hint) {
      const error = hint?.originalException;
      if (ignoreError({ error, event })) {
        const loggerInError = logWithCid();
        loggerInError.info(error, 'ignored error');
        return null;
      }

      const newEvent = structuredClone(event);

      const fingerprint = getFingerprint({ error, event: newEvent });
      if (fingerprint) {
        event.fingerprint = fingerprint; // eslint-disable-line no-param-reassign
      }

      if (rateLimitEvent(event)) {
        return null;
      }

      if (!event.tags?.correlationId) {
        const correlationId = getCorrelationId();
        event.tags = { correlationId, ...event.tags }; // eslint-disable-line no-param-reassign
      }

      return event;
    },
    debug,
    dsn,
    enabled,
    environment,
    ignoreErrors: [],
    integrations: [Sentry.extraErrorDataIntegration(), nodeProfilingIntegration()],
    profilesSampleRate: 1,
    release, // relative to tracesSampleRate, so count on that to remove health checks
    tracesSampler: (samplingContext) => pickSampleRate(samplingContext),
  });

  logger.info(
    {
      debug,
      enabled,
      environment,
      release,
    },
    'Enabling sentry',
  );
};

export default initialize;
