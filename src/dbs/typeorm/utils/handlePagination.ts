import getSkipPagination from '@/utils/getSkipPagination/index.js';

/*
 * https://typeorm.io/select-query-builder#using-pagination
 * skip + take - get all data then paginate
 * offset + limit - add offset and limit to PG query
 *
 * offset + limit is faster, but could be wrong with complicated joins and subqueries.
 */
type Options = { page: number, perPage: number }

const handlePagination = ({ page, perPage }: Options): { skip: number; take: number } => {
  const skip = getSkipPagination({ page, perPage });
  const take = perPage;
  return { skip, take };
};

const handlePaginationLimit = ({ page, perPage }: Options): { offset: number; limit: number } => {
  const offset = getSkipPagination({ page, perPage });
  const limit = perPage;
  return { limit, offset };
};

export default handlePagination;

export { handlePagination, handlePaginationLimit };
