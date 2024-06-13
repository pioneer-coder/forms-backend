import {
  MigrationInterface, QueryRunner, Table, TableColumn, TableIndex,
} from 'typeorm';

export class example0000000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        columns: [
          {
            default: 'nanoid(21)',
            isNullable: false,
            isPrimary: true,
            length: '21',
            name: 'id',
            type: 'char',
          },
          {
            default: 'now()',
            isNullable: false,
            name: 'createdAt',
            type: 'timestamptz',
          },
          {
            default: 'now()',
            isNullable: false,
            name: 'updatedAt',
            type: 'timestamptz',
          },
          {
            isNullable: true,
            name: 'deletedAt',
            type: 'timestamptz',
          },
          {
            isNullable: false,
            // isUnique: true, // - unique index instead
            name: 'slug',
            type: 'varchar',
          },
          // https://typeorm.io/entities#column-types-for-postgres
        ],
        indices: [
          new TableIndex({
            columnNames: ['slug'],
            isUnique: true,
            where: '"deletedAt" IS NULL',
          }),
        ],
        name: 'examples',
      }),
      true,
    );

    await queryRunner.addColumn(
      'examples',
      new TableColumn({
        name: 'someNumber',
        type: 'int',
      }),
    );

    await queryRunner.createIndex('examples', new TableIndex({
      columnNames: ['someNumber'],
      isUnique: true,
      where: '"deletedAt" IS NULL',
    }));

    await queryRunner.query('SOME SQL COMMEND');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // make sure that these are in the reverse order of the ups.

    await queryRunner.dropIndex('tables', new TableIndex({
      columnNames: ['slug'],
      isUnique: true,
      where: '"deletedAt" IS NULL',
    }));

    await queryRunner.dropColumn(
      'examples',
      new TableColumn({
        name: 'someNumber',
        type: 'int',
      }),
    );

    await queryRunner.dropTable('examples');
  }
}
