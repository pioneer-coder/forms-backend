import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DataSource } from 'typeorm';
import configuration from '../../configuration/index.js'; // can't use path in migrations (not sure why??), must be a relative import
import * as pgModels from './entity/index.js';

const FILE_NAME = fileURLToPath(import.meta.url);
const DIR_NAME = path.dirname(FILE_NAME);

export const createDataSource = ({
  database,
  host,
  password,
  poolSize,
  port,
  username,
}: {
  database: string;
  host: string;
  password: string;
  poolSize: number;
  port: number;
  username: string;
}): DataSource => new DataSource({
  database,
  // entities: [path.resolve(DIR_NAME, 'entity/!(*.spec).{js,ts}')], - this doesn't work in mocha --watch, not sure why
  entities: Object.values(pgModels),
  host,
  logging: configuration.POSTGRES_LOG_QUERIES,
  migrations: [path.resolve(DIR_NAME, 'migrations/*.js'), path.resolve(DIR_NAME, 'migrations/*.ts')],
  password,
  poolSize,
  port,
  type: 'postgres',
  username,
});

const AppDataSource = createDataSource({
  database: configuration.POSTGRES_DB,
  host: configuration.POSTGRES_HOST,
  password: configuration.POSTGRES_PASSWORD,
  poolSize: configuration.POSTGRES_NUM_CONNECTIONS,
  port: configuration.POSTGRES_PORT,
  username: configuration.POSTGRES_USER,
});

export default AppDataSource;
