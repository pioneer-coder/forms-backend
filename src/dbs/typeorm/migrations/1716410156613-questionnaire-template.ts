import {
  MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex,
} from 'typeorm';
import commonFields, * as baseFields from '../migration-helpers/common-fields.js';

export class QuestionnaireTemplate1716410156613 implements MigrationInterface {
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
            default: null,
            isNullable: false,
            name: 'slug',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: false,
            name: 'version',
            type: 'integer',
          },
          {
            default: null,
            isNullable: false,
            name: 'status',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: false,
            name: 'label',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: true,
            name: 'descriptionAST',
            type: 'jsonb',
          },
          {
            default: null,
            isNullable: true,
            name: 'descriptionHtml',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: true,
            name: 'descriptionText',
            type: 'varchar',
          },
        ],
        indices: [
          // only one current per creator
          new TableIndex({
            columnNames: ['slug', 'creatorId'],
            isUnique: true,
            where: 'status = \'current\' AND "deletedAt" IS NULL',
          }),
          // only one draft per creator
          new TableIndex({
            columnNames: ['slug', 'creatorId'],
            isUnique: true,
            where: 'status = \'draft\' AND "deletedAt" IS NULL',
          }),
          // only one of each version per creator
          new TableIndex({
            columnNames: ['slug', 'creatorId', 'version'],
            isUnique: true,
            where: '"deletedAt" IS NULL',
          }),
        ],
        name: 'questionnaire_templates',
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
            name: 'questionnaireTemplateId',
          },
          {
            default: null,
            isNullable: false,
            name: 'rank',
            type: 'integer',
          },
          {
            default: null,
            isNullable: false,
            name: 'slug',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: false,
            name: 'label',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: true,
            name: 'descriptionAST',
            type: 'jsonb',
          },
          {
            default: null,
            isNullable: true,
            name: 'descriptionHtml',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: true,
            name: 'descriptionText',
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
        indices: [
          // only one of each slug per questionnaire version
          new TableIndex({
            columnNames: ['slug', 'questionnaireTemplateId'],
            isUnique: true,
            where: '"deletedAt" IS NULL',
          }),
        ],
        name: 'section_templates',
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
            name: 'questionnaireTemplateId',
          },
          {
            ...baseFields.id,
            default: null,
            name: 'sectionTemplateId',
          },
          {
            ...baseFields.id,
            default: null,
            isNullable: true,
            name: 'listFieldTemplateId',
          },
          {
            default: null,
            isNullable: false,
            name: 'rank',
            type: 'integer',
          },
          {
            default: null,
            isNullable: false,
            name: 'key',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: false,
            name: 'label',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: true,
            name: 'descriptionAST',
            type: 'jsonb',
          },
          {
            default: null,
            isNullable: true,
            name: 'descriptionHtml',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: true,
            name: 'descriptionText',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: false,
            name: 'type',
            type: 'varchar',
          },
          {
            default: false,
            isNullable: false,
            name: 'isRequired',
            type: 'boolean',
          },
          {
            default: null,
            isNullable: false,
            name: 'options', // different for each type, see typings
            type: 'jsonb',
          },
          {
            default: null,
            isNullable: true,
            name: 'validation',
            type: 'jsonb',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['questionnaireTemplateId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'questionnaire_templates',
          }),
          new TableForeignKey({
            columnNames: ['sectionTemplateId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'section_templates',
          }),
          new TableForeignKey({
            columnNames: ['listFieldTemplateId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'field_templates',
          }),
        ],
        indices: [
          // only one of the slug per version of the questionnaire
          new TableIndex({
            columnNames: ['key', 'questionnaireTemplateId'],
            isUnique: true,
            where: '"deletedAt" IS NULL',
          }),
        ],
        name: 'field_templates',
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
            name: 'questionnaireTemplateId',
          },
          {
            default: null,
            isNullable: false,
            name: 'slug',
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
        indices: [
          // only one of the slug per version of the questionnaireTemplate
          new TableIndex({
            columnNames: ['slug', 'questionnaireTemplateId'],
            isUnique: true,
            where: '"deletedAt" IS NULL',
          }),
        ],
        name: 'questionnaire_assignee_templates',
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
            name: 'questionnaireAssigneeTemplateId',
          },
          {
            ...baseFields.id,
            default: null,
            name: 'fieldTemplateId',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['questionnaireAssigneeTemplateId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'questionnaire_assignee_templates',
          }),
          new TableForeignKey({
            columnNames: ['fieldTemplateId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'field_templates',
          }),
        ],
        indices: [
          // only one of the slug per version of the questionnaireTemplate
          new TableIndex({
            columnNames: ['questionnaireAssigneeTemplateId', 'fieldTemplateId'],
            isUnique: true,
            where: '"deletedAt" IS NULL',
          }),
        ],
        name: 'field_assignee_templates',
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
            name: 'questionnaireTemplateId',
          },
          {
            ...baseFields.id,
            default: null,
            name: 'creatorId',
          },
          {
            default: null,
            isNullable: false,
            name: 'slug',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: false,
            name: 'version',
            type: 'integer',
          },
          {
            default: null,
            isNullable: false,
            name: 's3Key',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: false,
            name: 'fileName',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: true,
            name: 'descriptionAST',
            type: 'jsonb',
          },
          {
            default: null,
            isNullable: true,
            name: 'descriptionHtml',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: true,
            name: 'descriptionText',
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
        indices: [
          // only one of the slug per version of the questionnaireTemplate
          new TableIndex({
            columnNames: ['slug', 'questionnaireTemplateId'],
            isUnique: true,
            where: '"deletedAt" IS NULL',
          }),
          // only one of each version
          new TableIndex({
            columnNames: ['slug', 'version', 'creatorId'],
            isUnique: true,
            where: '"deletedAt" IS NULL',
          }),
        ],
        name: 'pdf_templates',
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
            name: 'pdfTemplateId',
          },
          {
            default: null,
            isNullable: false,
            name: 'key',
            type: 'varchar',
          },
          {
            default: null,
            isNullable: true,
            name: 'data',
            type: 'jsonb',
          },
          {
            default: null,
            isNullable: false,
            name: 'page',
            type: 'integer',
          },
          {
            default: null,
            isNullable: false,
            name: 'positionX',
            type: 'float',
          },
          {
            default: null,
            isNullable: false,
            name: 'positionY',
            type: 'float',
          },
          {
            default: null,
            isNullable: false,
            name: 'positionHeight',
            type: 'float',
          },
          {
            default: null,
            isNullable: false,
            name: 'positionWidth',
            type: 'float',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['pdfTemplateId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'pdf_templates',
          }),
        ],
        indices: [
          // only one of the key per version of the pdfTemplate
          new TableIndex({
            columnNames: ['key', 'pdfTemplateId'],
            isUnique: true,
            where: '"deletedAt" IS NULL',
          }),
        ],
        name: 'pdf_field_templates',
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pdf_field_templates');
    await queryRunner.dropTable('pdf_templates');
    await queryRunner.dropTable('field_assignee_templates');
    await queryRunner.dropTable('field_templates');
    await queryRunner.dropTable('section_templates');
    await queryRunner.dropTable('questionnaire_templates');
  }
}
