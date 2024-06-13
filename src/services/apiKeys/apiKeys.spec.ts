import { expect } from 'chai';
import logger from '@/utils/logger/index.js';
import { pgModels, pgRepositories } from '@/dbs/typeorm/index.js';
import { MissingRequiredFieldsError, NotFoundError } from '@/errors/index.js';
import { fixtures } from '@test/index.js';
import apiKeysService from './index.js';

const log = logger;

describe('services/apiKeys', function () {
  describe('.createApiKey', function () {
    it('should return the created key', async function () {
      const apiKey = await apiKeysService.createApiKey({
        data: {
          description: 'the description',
          key: 'some-random-string',
          name: 'the key',
          slug: 'the-slug',
        },
        log,
      });
      expect(apiKey.id).to.be.ok;
      expect(apiKey).to.shallowDeepEqual({
        description: 'the description',
        key: 'some-random-string',
        name: 'the key',
        slug: 'the-slug',
      });
    });

    it('should persist the key', async function () {
      await apiKeysService.createApiKey({
        data: {
          description: 'the description',
          key: 'some-random-string',
          name: 'the key',
          slug: 'the-slug',
        },
        log,
      });
      const keys = await pgRepositories.apiKey.find();
      expect(keys).to.be.an('array').with.length(1);
      expect(keys[0]).to.shallowDeepEqual({
        description: 'the description',
        key: 'some-random-string',
        name: 'the key',
        slug: 'the-slug',
      });
    });

    it('should be able to create a new apiKey with the same slug as one that was soft deleted', async function () {
      const apiKey1 = await fixtures.apiKey();
      await apiKeysService.deleteApiKey({ id: apiKey1.id, log });
      await apiKeysService.createApiKey({
        data: {
          description: 'the description',
          key: 'the-other-key',
          name: 'the key',
          slug: apiKey1.slug,
        },
        log,
      });
    });

    it('should be able to create a new apiKey with the same key as one that was soft deleted', async function () {
      const apiKey1 = await fixtures.apiKey();
      await apiKeysService.deleteApiKey({ id: apiKey1.id, log });
      await apiKeysService.createApiKey({
        data: {
          description: 'the description',
          key: apiKey1.key,
          name: 'the key',
          slug: 'the-other-slug',
        },
        log,
      });
    });
  });

  describe('.searchApiKeys', function () {
    it('should return the one apiKey', async function () {
      const apiKey1 = await fixtures.apiKey();
      const { items: apiKeys } = await apiKeysService.searchApiKeys({ log, page: 1, perPage: 10 });
      expect(apiKeys).to.deep.equal([apiKey1]);
    });

    it('should return all the api keys', async function () {
      const apiKey1 = await fixtures.apiKey();
      const apiKey2 = await fixtures.apiKey();
      const { items: apiKeys } = await apiKeysService.searchApiKeys({ log, page: 1, perPage: 10 });
      expect(apiKeys.map((key) => key.slug)).to.have.members([apiKey1.slug, apiKey2.slug]);
    });

    it('should return only one pages worth of keys, but the real number of items', async function () {
      await fixtures.apiKey();
      await fixtures.apiKey();
      await fixtures.apiKey();
      const { numItems, items: apiKeys } = await apiKeysService.searchApiKeys({ log, page: 1, perPage: 2 });
      expect(apiKeys).to.be.an('array').with.length(2);
      expect(numItems).to.deep.equal(3);
    });
  });

  describe('.deleteApiKey', function () {
    it('should delete the api key', async function () {
      const apiKey1 = await fixtures.apiKey();
      await apiKeysService.deleteApiKey({ id: apiKey1.id, log });
      const numItems = await pgRepositories.apiKey.count();
      expect(numItems).to.equal(0);
    });

    it('should soft delete the api key', async function () {
      const apiKey1 = await fixtures.apiKey();
      await apiKeysService.deleteApiKey({ id: apiKey1.id, log });
      const withDeleted = await pgRepositories.apiKey.find({ withDeleted: true });
      expect(withDeleted[0]).to.be.an.instanceOf(pgModels.ApiKey);
      expect(withDeleted[0].id).to.equal(apiKey1.id);
      expect(withDeleted[0].deletedAt).not.to.equal(null);
    });
  });

  describe('.getByKey', function () {
    it('should find the api key, with the slug', async function () {
      const apiKey = await fixtures.apiKey();
      const found = await apiKeysService.getByKey({ key: apiKey.key });
      expect(found).to.be.an.instanceOf(pgModels.ApiKey);
      expect(found?.id).to.equal(apiKey.id);
      expect(found?.slug).to.equal(apiKey.slug);
    });

    it('should return null if the key can not be found', async function () {
      const found = await apiKeysService.getByKey({ key: 'blah' });
      expect(found).to.equal(null);
    });

    it('should reject if there is no key passed in', async function () {
      const error = await apiKeysService.getByKey({ key: undefined as unknown as string })
        .catch((err) => err);
      expect(error).to.be.an.instanceOf(MissingRequiredFieldsError);
      expect(error.response.missingFields).to.deep.equal(['key']);
    });
  });

  describe('.updateById', function () {
    beforeEach(async function () {
      this.apiKey = await fixtures.apiKey();
    });

    it('should return the updated item', async function () {
      const body = {
        description: 'some other description',
        key: 'someotherkey',
        name: 'some other name',
        slug: 'some-other-slug',
      };
      const apiKey = await apiKeysService.updateById({ body, id: this.apiKey.id, log });
      expect(apiKey).to.be.an.instanceOf(pgModels.ApiKey);
      expect(apiKey).to.shallowDeepEqual(body);
    });

    it('should persist the changes', async function () {
      const body = {
        description: 'some other description',
        key: 'someotherkey',
        name: 'some other name',
        slug: 'some-other-slug',
      };
      await apiKeysService.updateById({ body, id: this.apiKey.id, log });
      const apiKey = await pgRepositories.apiKey.findOne({
        where: { id: this.apiKey.id },
      });
      expect(apiKey).to.shallowDeepEqual(body);
    });

    it('should reject if NotFound if there is no entity with that id.', async function () {
      const body = {};
      const error = await apiKeysService.updateById({ body, id: 'some-other-id', log }).catch((e) => e);
      expect(error).to.be.an.instanceOf(NotFoundError);
    });
  });
});
