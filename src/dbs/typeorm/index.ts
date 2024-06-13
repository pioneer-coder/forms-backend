import AppDataSource, { createDataSource } from './dataSource.js';
import * as pgModels from './entity/index.js';
import createRepositories from './repositories.js';
import type {
  FindAndCountWithType,
  FindOneWithRelations,
  FindWithRelations,
  FindAndCountWithRelations,
} from './utility-types.js';

const pgRepositories = createRepositories(AppDataSource);

export { default as handlePagination, handlePaginationLimit } from './utils/handlePagination.js';
export default AppDataSource;
export {
  pgModels,
  pgRepositories,
  createDataSource,
};
export type {
  FindAndCountWithType,
  FindOneWithRelations,
  FindWithRelations,
  FindAndCountWithRelations,
};
