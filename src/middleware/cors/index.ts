import cors from 'cors';
import configuration from '@/configuration/index.js';
import parseOriginList from './parseOriginList.js';

// @todo - This shouldn't be needed...
// But couldn't figure out how to get isArray to return T[], so is currently (T|null)[]
// So this is just to make typescript realize it can't be null.
const allowedOrigins = parseOriginList(configuration.CORS_ENABLED_ORIGINS.filter((i) => Boolean(i)) as string[]);
const allowedHeaders = [
  'Content-Type',
  'x-noodle-api-key',
  'authorization',
  'x-correlationId',
  'x-noodle-client-version',
  'sentry-trace',
];

const exposedHeaders = [
  'x-correlationId',
];

export default cors({
  allowedHeaders,
  exposedHeaders,
  origin: allowedOrigins,
});
