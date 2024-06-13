import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import commonFields, * as baseFields from '../migration-helpers/common-fields.js';

export class Responses1716928131797 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        columns: [
          ...commonFields,
          {
            ...baseFields.id,
            default: null,
            name: 'creatorId',
          },
          {
            ...baseFields.id,
            default: null,
            name: 'questionnaireTemplateId',
          },
          {
            default: null,
            isNullable: false,
            name: 'status',
            type: 'varchar',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['questionnaireTemplateId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'questionnaire_templates',
          }),
        ],
        name: 'questionnaires',
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        columns: [
          ...commonFields,
          {
            ...baseFields.id,
            default: null,
            name: 'questionnaireId',
          },
          {
            ...baseFields.id,
            default: null,
            name: 'questionnaireAssigneeTemplateId',
          },
          {
            ...baseFields.id,
            default: null,
            name: 'personId',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['questionnaireId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'questionnaires',
          }),
          new TableForeignKey({
            columnNames: ['questionnaireAssigneeTemplateId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'questionnaire_assignee_templates',
          }),
        ],
        name: 'questionnaire_assignees',
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        columns: [
          ...commonFields,
          {
            ...baseFields.id,
            default: null,
            name: 'questionnaireId',
          },
          {
            ...baseFields.id,
            default: null,
            name: 'submittedById', // person.id
          },
          {
            ...baseFields.id,
            default: null,
            name: 'fieldTemplateId',
          },
          {
            default: null,
            isNullable: true,
            name: 'value', // store all as jsonb, each type needs to be deserialized.
            type: 'jsonb',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['questionnaireId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'questionnaires',
          }),
          new TableForeignKey({
            columnNames: ['fieldTemplateId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'field_templates',
          }),
        ],
        indices: [
          // only one answer per questionnaire
          new TableIndex({
            columnNames: ['questionnaireId', 'fieldTemplateId'],
            isUnique: true,
            where: '"deletedAt" IS NULL',
          }),
        ],
        name: 'questionnaire_responses',
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('questionnaire_responses');
    await queryRunner.dropTable('questionnaire_assignees');
    await queryRunner.dropTable('questionnaires');
  }
}
