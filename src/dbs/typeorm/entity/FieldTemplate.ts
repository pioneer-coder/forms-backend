import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { FieldType, Validation } from '@/typings/shared.js';
import { SlateAST } from '@/utils/slate/index.js';

import BaseEntity from './BaseEntity.js';
import SectionTemplate from './SectionTemplate.js';
import FieldAssigneeTemplate from './FieldAssigneeTemplate.js';

@Entity({
  name: 'field_templates',
})
class FieldTemplate extends BaseEntity {
  @Column({ nullable: false, type: 'varchar' })
  public questionnaireTemplateId: string;

  @Column({ nullable: false, type: 'varchar' })
  public sectionTemplateId: string;

  @ManyToOne(() => SectionTemplate)
  @JoinColumn({ name: 'sectionTemplateId' })
  public sectionTemplate?: Relation<SectionTemplate>;

  @Column({ nullable: false, type: 'varchar' })
  public listFieldTemplateId: string;

  @ManyToOne(() => FieldTemplate)
  @JoinColumn({ name: 'listFieldTemplateId' })
  public listFieldTemplate?: FieldTemplate; // eslint-disable-line no-use-before-define

  @Column({ nullable: false, type: 'integer' })
  public rank: number;

  @Column({ nullable: false, type: 'varchar' })
  public key: string;

  @Column({ nullable: false, type: 'varchar' })
  public label: string;

  @Column({ nullable: true, type: 'jsonb' })
  public descriptionAST: SlateAST | null;

  @Column({ nullable: true, type: 'varchar' })
  public descriptionHtml: string | null;

  @Column({ nullable: true, type: 'varchar' })
  public descriptionText: string | null;

  @Column({ nullable: false, type: 'varchar' })
  public type: FieldType;

  @Column({ nullable: false, type: 'boolean' })
  public isRequired: boolean;

  @Column({ nullable: true, type: 'jsonb' })
  public options: Record<string, unknown>;

  @Column({ nullable: true, type: 'jsonb' })
  public validation: Validation | null;

  @OneToMany(() => FieldTemplate, (fieldTemplate) => fieldTemplate.listFieldTemplate)
  @JoinColumn({ name: 'listFieldTemplateId' })
  public listItemTemplates?: Relation<FieldTemplate>[]; // eslint-disable-line no-use-before-define

  @OneToMany(() => FieldAssigneeTemplate, (assignee) => assignee.fieldTemplate)
  @JoinColumn({ name: 'listFieldTemplateId' })
  public fieldAssigneeTemplates?: FieldAssigneeTemplate[];
}

export default FieldTemplate;
