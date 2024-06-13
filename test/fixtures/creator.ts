import { nanoid } from 'nanoid';
import { slug } from './index.js';

type Input = {
  id?: string;
  slug?: string;
};

type Output = {
  id: string;
  slug: string;
};

const createCreator = (input: Input = {}): Output => ({
  id: input.id || nanoid(),
  slug: input.slug || slug(),
});

export default createCreator;
