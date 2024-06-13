const getSkipPagination = ({ page, perPage }: { page: number, perPage: number }): number => Math.round(
  Math.max(perPage, 0) * (Math.max(page, 1) - 1),
);

export default getSkipPagination;
