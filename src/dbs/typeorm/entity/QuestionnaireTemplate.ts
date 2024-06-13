import {
  Column, Entity, OneToMany, Relation,
} from 'typeorm';
import { SlateAST } from '@/utils/slate/index.js';
import BaseEntity from './BaseEntity.js';
import SectionTemplate from './SectionTemplate.js';

@Entity({
  name: 'questionnaire_templates',
})
class QuestionnaireTemplate extends BaseEntity {
  @Column({ nullable: false, type: 'varchar' })
  public slug: string;

  @Column({ nullable: false, type: 'varchar' })
  public creatorId: string;

  @Column({ nullable: false, type: 'integer' })
  public version: number;

  @Column({ nullable: false, type: 'varchar' })
  public status: 'draft' | 'abandoned' | 'current' | 'stale';

  @Column({ nullable: false, type: 'varchar' })
  public label: string;

  @Column({ nullable: true, type: 'jsonb' })
  public descriptionAST: SlateAST | null;

  @Column({ nullable: true, type: 'varchar' })
  public descriptionHtml: string | null;

  @Column({ nullable: true, type: 'varchar' })
  public descriptionText: string | null;

  @OneToMany(() => SectionTemplate, (section) => section.questionnaireTemplate)
  public sectionTemplates?: Relation<SectionTemplate>[];
}

export default QuestionnaireTemplate;
