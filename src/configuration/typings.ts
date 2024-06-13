export type Configuration = {
  CORS_ENABLED_ORIGINS: (string | null)[]; // @todo - would be nice to not have the | null here, but hard to get rid of.
  HOST: string;
  JWT_SIGNING_SECRET: string;
  JWT_SIGNING_SECRET_PREVIOUS: string;
  LOG_LEVEL: string;
  PORT: number;
  POSTGRES_DB: string;
  POSTGRES_HOST: string;
  POSTGRES_LOG_QUERIES: boolean;
  POSTGRES_NUM_CONNECTIONS: number;
  POSTGRES_PASSWORD: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  PROJECT_NAME: string;
  SHELL_PROMPT: string;
  VERSION: string;
};

export type ConfigurationKeys = keyof Configuration;

export type CastingOptions<T> = {
  defaultValue?: T | null;
  isRequired?: boolean;
};

export type CastingResponse<T> = T | null;

export type Deserializer<T> = (str: string, key?: string, options?: CastingOptions<T>) => CastingResponse<T>;
export type BaseHandler<T> = (key: string, options?: CastingOptions<T>) => CastingResponse<T>;
export interface Handler<T> {
  (key?: string, options?: CastingOptions<T>): CastingResponse<T>;
  deserializer: Deserializer<T>;
}
