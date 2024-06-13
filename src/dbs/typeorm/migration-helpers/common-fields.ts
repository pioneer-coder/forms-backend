import { TableColumnOptions } from 'typeorm';

export const id = {
  default: 'nanoid(25)',
  isNullable: false,
  length: '25',
  type: 'varchar',
};

export const personIdForeignKey = {
  columnNames: ['personId'],
  onDelete: 'NO ACTION',
  onUpdate: 'CASCADE',
  referencedColumnNames: ['id'],
  referencedTableName: 'people',
};

export const primaryId = {
  ...id,
  isPrimary: true,
  name: 'id',
};

export const createdAt = {
  default: 'now()',
  isNullable: false,
  name: 'createdAt',
  type: 'timestamptz',
};

export const updatedAt = {
  default: 'now()',
  isNullable: false,
  name: 'updatedAt',
  type: 'timestamptz',
};

export const deletedAt = {
  isNullable: true,
  name: 'deletedAt',
  type: 'timestamptz',
};

const commonFields: TableColumnOptions[] = [
  primaryId,
  createdAt,
  updatedAt,
  deletedAt,
];

export default commonFields;
