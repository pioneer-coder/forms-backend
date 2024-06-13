import { Logger } from '@/utils/logger/index.js';

export type AllowedMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';
type CommonProps = { cid?: string; log: Logger };
export type ApiHandler<T = void> = T extends void ? CommonProps : CommonProps & T

export type PaginationParams = Partial<{
  first: number;
  after: string;
  before: string;
}>;

export type OKResponse = { message: 'OK' };
export type NOKResponse = { message: 'NOK' };

type JWT = string;

export type JWTResponse = {
  token: JWT;
};

export type PaginatedResponse<I> = {
  page: number;
  numItems: number;
  numPages: number;
  perPage: number;
  items: Array<I>;
};

export type PaginatedServiceResponse<I> = {
  numItems: number;
  items: Array<I>;
};

export type PaginatedRequestQuery = { page?: number; perPage?: number };

export type PaginatedApiDefinition<I extends { query: unknown, body: unknown, params: unknown, item: unknown }> = {
  query: I['query'] extends void ? PaginatedRequestQuery : PaginatedRequestQuery & I['query'];
  body: I['body'];
  params: I['params'];
  response: PaginatedResponse<I['item']>;
};
