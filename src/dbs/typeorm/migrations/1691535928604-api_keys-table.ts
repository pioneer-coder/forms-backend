import {
  MigrationInterface, QueryRunner, Table, TableIndex,
} from 'typeorm';
import commonFields from '../migration-helpers/common-fields.js';

export class ApiKeysTable1691535928604 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        columns: [
          ...commonFields,
          {
            isNullable: false,
            name: 'name',
            type: 'varchar',
          },
          {
            isNullable: false,
            name: 'description',
            type: 'varchar',
          },
          {
            isNullable: false,
            name: 'slug',
            type: 'varchar',
          },
          {
            isNullable: false,
            name: 'key',
            type: 'varchar',
          },
        ],
        indices: [
          new TableIndex({
            columnNames: ['slug'],
            isUnique: true,
            where: '"deletedAt" IS NULL',
          }),
          new TableIndex({
            columnNames: ['key'],
            isUnique: true,
            where: '"deletedAt" IS NULL',
          }),
        ],
        name: 'api_keys',
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('api_keys');
  }
}
