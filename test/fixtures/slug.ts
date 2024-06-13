import { faker } from '@faker-js/faker';
import slugify from './slugify/index.js';

const createRandomSlug = (): string => slugify({ name: `${faker.person.firstName()} ${faker.person.lastName()}` });

export default createRandomSlug;
