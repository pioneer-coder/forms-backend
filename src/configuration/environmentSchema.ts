import { z } from 'zod';

const environmentSchema = {
  CORS_ENABLED_ORIGINS: z.string().array(),
  HOST: z.string(),
  JWT_SIGNING_SECRET: z.string(),
  JWT_SIGNING_SECRET_PREVIOUS: z.string(),
  LOG_LEVEL: z.string().default('info'), // @todo - enum
  NOODLE_API_API_KEY: z.string(),
  NOODLE_API_HOST: z.string(),
  PORT: z.number().int().default(3600),
  POSTGRES_DB: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_LOG_QUERIES: z.boolean().default(false),
  POSTGRES_NUM_CONNECTIONS: z.number().int(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_PORT: z.number().int().default(5432),
  POSTGRES_USER: z.string(),
  SENTRY_DEBUG: z.boolean(),
  SENTRY_DSN: z.string(),
  SENTRY_ENABLED: z.boolean(),
  SENTRY_ENVIRONMENT: z.string(),
};

export default environmentSchema;
