import { nanoid } from 'nanoid';
import { pgRepositories, pgModels } from '@/dbs/typeorm/index.js';
import setFixtureValues from './setFixtureValues.js';
import createSlug from './slug.js';

type Options = Partial<Pick<pgModels.ApiKey, 'slug' | 'key' | 'name' | 'description'>>;

const createApiKey = async (opts: Options = {}): Promise<pgModels.ApiKey> => {
  const apiKey = await setFixtureValues(
    new pgModels.ApiKey(),
    opts,
    {
      description: () => 'the description',
      key: () => nanoid(),
      name: () => 'the name',
      slug: () => createSlug(),
    },
  );
  return pgRepositories.apiKey.save(apiKey);
};

export default createApiKey;
