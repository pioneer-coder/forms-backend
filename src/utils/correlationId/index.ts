import { AsyncLocalStorage } from 'node:async_hooks';
import { nanoid } from 'nanoid';

export const cidLocalStorage = new AsyncLocalStorage();

const generateCorrelationId = (prefix?: string): string => {
  const id = nanoid();
  return prefix ? `${prefix}:${id}` : id;
};

export const getCorrelationId = (): string => (cidLocalStorage.getStore() || nanoid()) as string;
export default generateCorrelationId;
