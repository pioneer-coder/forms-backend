import { PropertiesAreNotUndefined } from '@/typings/utility.js';

export type FindAndCountWithType<M> = [Array<M>, number];
export type FindOneWithRelations<M, K extends keyof M> = PropertiesAreNotUndefined<M, K> | null;
export type FindWithRelations<M, K extends keyof M> = Array<PropertiesAreNotUndefined<M, K>>;
export type FindAndCountWithRelations<M, K extends keyof M> = FindAndCountWithType<PropertiesAreNotUndefined<M, K>>;
