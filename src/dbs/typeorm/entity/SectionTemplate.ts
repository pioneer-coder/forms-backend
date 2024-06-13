import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { SlateAST } from '@/utils/slate/index.js';
import BaseEntity from './BaseEntity.js';
import QuestionnaireTemplate from './QuestionnaireTemplate.js';
import FieldTemplate from './FieldTemplate.js';

@Entity({
  name: 'section_templates',
})
class SectionTemplate extends BaseEntity {
  @Column({ nullable: false, type: 'varchar' })
  public questionnaireTemplateId: string;

  @ManyToOne(() => QuestionnaireTemplate)
  @JoinColumn({ name: 'questionnaireTemplateId' })
  public questionnaireTemplate?: Relation<QuestionnaireTemplate>;

  @Column({ nullable: false, type: 'varchar' })
  public slug: string;

  @Column({ nullable: false, type: 'integer' })
  public rank: number;

  @Column({ nullable: false, type: 'varchar' })
  public label: string;

  @Column({ nullable: true, type: 'jsonb' })
  public descriptionAST: SlateAST | null;

  @Column({ nullable: true, type: 'varchar' })
  public descriptionHtml: string | null;

  @Column({ nullable: true, type: 'varchar' })
  public descriptionText: string | null;

  @OneToMany(() => FieldTemplate, (fieldTemplate) => fieldTemplate.sectionTemplate)
  public fieldTemplates?: Relation<FieldTemplate>[];
}

export default SectionTemplate;
