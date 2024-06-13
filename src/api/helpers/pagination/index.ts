type CommonProps<I> = { numItems: number, items: I, perPage: number, page: number };

function makePaginatedResponse<I extends Array<unknown>>(args: CommonProps<I> & { presenter?: never }): {
  numItems: number;
  page: number;
  perPage: number;
  numPages: number;
  items: I;
}

function makePaginatedResponse<I extends Array<unknown>, Pr extends (item: I[number]) => unknown>(args: CommonProps<I> & { presenter: Pr }): {
  numItems: number;
  page: number;
  perPage: number;
  presenter: Pr;
  numPages: number;
  items: Array<ReturnType<Pr>>;
}

function makePaginatedResponse<I extends Array<unknown>, Pr extends(item: I[number]) => unknown>({
  numItems, items, perPage, page, presenter,
}: {
  numItems: number,
  items: I,
  perPage: number,
  page: number,
  presenter?: Pr
}): unknown {
  return {
    items: presenter ? items.map(presenter) : items,
    numItems,
    numPages: Math.ceil(numItems / perPage),
    page,
    perPage,
  };
}

export { makePaginatedResponse };

type BaseOption = {
  defaultValue: number,
  min: number,
  type: 'integer',
};

export const deserializeQueryPaginationOptions: { page: BaseOption, perPage: BaseOption } = {
  page: { defaultValue: 1, min: 1, type: 'integer' },
  perPage: { defaultValue: 20, min: 1, type: 'integer' },
};
