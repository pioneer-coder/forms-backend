import _ from 'lodash';
import { ApiHandler } from '@/typings/api.js';
import { PaginatedFunctionResponse } from '@/typings/utility.js';
import { handlePagination, pgModels, pgRepositories } from '@/dbs/typeorm/index.js';
import checkForMissingProps from '@/utils/checkForMissingFields/index.js';
import { NotFoundError } from '@/errors/index.js';

class ApiKeysService {
  async createApiKey({ data }: ApiHandler<{ data: Pick<pgModels.ApiKey, 'key' | 'slug' | 'description' | 'name'> }>): Promise<pgModels.ApiKey> {
    const apiKey = new pgModels.ApiKey();
    Object.assign(apiKey, _.pick(data, 'key', 'slug', 'description', 'name'));
    return pgRepositories.apiKey.save(apiKey);
  }

  async deleteApiKey({ id }: ApiHandler<{ id: pgModels.ApiKey['id'] }>): Promise<void> {
    await pgRepositories.apiKey.softDelete(id);
  }

  async searchApiKeys({ page, perPage }: ApiHandler<{ page: number, perPage: number }>): Promise<PaginatedFunctionResponse<pgModels.ApiKey>> {
    const [items, numItems] = await pgRepositories.apiKey.findAndCount({
      ...handlePagination({ page, perPage }),
    });
    return { items, numItems };
  }

  async getByKey({ key }: { key: pgModels.ApiKey['key'] }): Promise<pgModels.ApiKey | null> {
    checkForMissingProps({ key });
    return pgRepositories.apiKey.findOne({
      where: { key },
    });
  }

  async updateById({ id, body }: ApiHandler<{ id: string, body: Partial<Pick<pgModels.ApiKey, 'name' | 'description' | 'slug' | 'key'>> }>): Promise<pgModels.ApiKey> {
    const apiKey = await pgRepositories.apiKey.findOne({
      where: { id },
    });
    if (!apiKey) {
      throw new NotFoundError();
    }
    const {
      key, slug, name, description,
    } = body;
    Object.assign(apiKey, {
      description, key, name, slug,
    });
    return pgRepositories.apiKey.save(apiKey);
  }
}

const apiKeysService = new ApiKeysService();

export default apiKeysService;
