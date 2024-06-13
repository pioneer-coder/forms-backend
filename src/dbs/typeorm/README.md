# Postgres Database

The postgres DB is a recent addition, many of the suggestions below have not been battle tested in our system and are subject to change. Follow them where possible, but feel free to bring up any changes that will simplify things for you in [noodle#dev](https://noodle-rcm3610.slack.com/archives/C02NR993DTL).

## ORM
Where using [typeorm](https://typeorm.io/) as our ORM between the app and postgres.
Typeorm supports both [Active Record and Data Mapper patterns](https://typeorm.io/active-record-data-mapper), we are currently using Data Mapper, mostly because it was easier to setup soft deletes.

## special columns
### Id
To match other ids, we want to use nanoid to generate the ids.
We have not (yet) created a function to create nanoid's inside of psotgres, so the id must be created in the application layer (for now).

### createdAt
This is the date/time that the row was created, it is set automatically by postgres (needs to be part of the column definition)

```js
  {
    default: 'now()',
    isNullable: false,
    name: 'createdAt',
    type: 'timestamptz',
  },
```

### updatedAt
This is the date/time that the row was most recently updated, it is set automatically by typeorm

```js
  {
    default: 'now()',
    isNullable: false,
    name: 'updatedAt',
    type: 'timestamptz',
  },
```

### deletedAt - AKA soft delete
This allows for [soft delete's](https://www.jmix.io/blog/to-delete-or-to-soft-delete-that-is-the-question/)
Delete's should set this field, reads should add `WHERE "deletedAt" IS NULL` to queries.

There are definitions for all of these in [src/dbs/typeorm/migration-helpers/common-fields.ts](src/dbs/typeorm/migration-helpers/common-fields.ts). Please don't include these in migrations, however. That would change a migration after it's been run.

```js
  {
    isNullable: true,
    name: 'deletedAt',
    type: 'timestamptz',
  },
```
## [Migrations](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md)

When writing migrations keep in mind that for a little while (at least the graceful shutdown time which is currently 2 minutes, but probably more while container is provisioned) both the new and old code will be running against this database. This means that any migration needs to work in both the old and new code.
This is fine (usually) if adding tabes or columns, but changing (eg changing name/type) can cause problems.
Changes should be broken into multiple PRs allowing for backwards compatability.

Data migrations don't belong in the migrations itself, these should only be structural changes. Where possible stories that require data migrations should be in multiple PRs where the data migration comes after and doesn't change data that was correctly written by the new code.

Thought also needs to be given to the down migrations.
These are rarely used, but is very nice to have when needed.

By default, unique columns are unconditional, a conditional unique index needs to be manually created for columns that are unique in tables with soft delete enabled.
This is that, for example, you can add a user with email='an@ema.il', soft delete that user, then allow another user with that same email. The default unique constraint would not allow the second user to be created because of the deleted one.

While creating the table
```js
      new Table({
        indices: [
          new TableIndex({
            isUnique: true,
            columnNames: ['slug'],
            where: '"deletedAt" IS NULL',
          }),
        ]
```

Adding to an existing table
```js
    await queryRunner.createIndex('examples', new TableIndex({
      isUnique: true,
      columnNames: ['someNumber'],
      where: '"deletedAt" IS NULL',
    }));
```

After creating the migration, you will need to create or update a model in [src/dbs/typeorm/entity](src/dbs/typeorm/entity). See example [here](src/dbs/typeorm/entity/ScheduledEvent.ts).

Finally, if you are creating a new model, you will need to add the model to the DataSource in [src/dbs/typeorm/index.ts](src/dbs/typeorm/index.ts):

```js
  const AppDataSource = new DataSource({
    database: configuration.POSTGRES_DB,
    entities: [ApiKey, ScheduledEvent], // Add your new model here
    host: configuration.POSTGRES_HOST,
    logging: configuration.POSTGRES_LOG_QUERIES,
    migrations: [path.resolve(__dirname, 'migrations/*.js'), path.resolve(__dirname, 'migrations/*.ts')],
    password: configuration.POSTGRES_PASSWORD,
    port: configuration.POSTGRES_PORT,
    type: 'postgres',
    username: configuration.POSTGRES_USER,
  });
```

[An example migration file](src/dbs/typeorm/migration-example.ts)

List of valid column types for postgres: https://typeorm.io/entities#column-types-for-postgres

### Useful scripts
- `yarn pg:recreate` - delete your entire local/dev DB and rerun all migrations
- `yarn pg:test:recreate` - delete your entire test DB and rerun all migrations
- `yarn pg:migration:run` - apply new migrations to your local/dev DB
- `yarn pg:test:migration:run` - apply new migrations to your test DB
- `yarn pg:cli` - open psql with your local/dev DB

## Example commands
### Create
```js
  async createApiKey({ data }: ApiHandler<{ data: Pick<pgModels.ApiKey, 'key' | 'slug' | 'description' | 'name'> }>): Promise<pgModels.ApiKey> {
    const apiKey = new pgModels.ApiKey();
    Object.assign(apiKey, {
      ...data,
      id: nanoid(),
    });
    return pgDataSource.getRepository(pgModels.ApiKey).save(apiKey);
  }
```

### Find many
In general bulk api responses should be paginated.
The pagination response needs the total number of items and one page of data.
To help with this always respond with `Promise<PaginatedFunctionResponse<TypeForTheItem>>`
Should probably use `findAndCount` to do the find to make this easier.
```js
  async searchApiKeys({ page, perPage }: ApiHandler<{ page: number, perPage: number }>): Promise<PaginatedFunctionResponse<pgModels.ApiKey>> {
    const [items, numItems] = await pgDataSource.getRepository(pgModels.ApiKey).findAndCount({
      skip: getSkipPagination({ page, perPage }),
      take: perPage,
    });
    return { items, numItems };
  }
```

### Delete
Deletes should be soft, ie set the deletedAt field, not actually deleted.

```js
  async deleteApiKey({ id }: ApiHandler<{ id: pgModels.ApiKey['id'] }>): Promise<void> {
    await pgDataSource.getRepository(pgModels.ApiKey).softDelete(id);
  }
```

### Find by id
@TODO

## In tests
### soft delete
To test that the soft delete worked correctly you need to test that both a find/count do not find the item and test that the row is still in the database. This is to document by test that there is a desire to soft delete the table.

For example:
```js
  describe('.deleteApiKey', function () {
    it('should delete the api key', async function () {
      const apiKey1 = await fixtures.apiKey();
      await apiKeysService.deleteApiKey({ id: apiKey1.id, log });
      const numItems = await pgDataSource.getRepository(pgModels.ApiKey).count();
      expect(numItems).to.equal(0);
    });

    it('should soft delete the api key', async function () {
      const apiKey1 = await fixtures.apiKey();
      await apiKeysService.deleteApiKey({ id: apiKey1.id, log });
      const withDeleted = await pgDataSource.getRepository(pgModels.ApiKey).find({ withDeleted: true });
      expect(withDeleted[0]).to.be.an.instanceOf(pgModels.ApiKey);
      expect(withDeleted[0].id).to.equal(apiKey1.id);
      expect(withDeleted[0].deletedAt).not.to.equal(null);
    });
  });
```


## Other stuff
adding `POSTGRES_LOG_QUERIES=true` to a command logs all the raw SQL queries created, this is often useful when debugging.
