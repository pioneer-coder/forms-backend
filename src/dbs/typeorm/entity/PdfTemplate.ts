import {
  Entity, Column, JoinColumn, ManyToOne, Relation,
} from 'typeorm';
import { SlateAST } from '@/utils/slate/index.js';
import BaseEntity from './BaseEntity.js';
import QuestionnaireTemplate from './QuestionnaireTemplate.js';

@Entity({
  name: 'pdf_templates',
})
class PdfTemplate extends BaseEntity {
  @Column({ nullable: false, type: 'varchar' })
  public questionnaireTemplateId: string;

  @ManyToOne(() => QuestionnaireTemplate)
  @JoinColumn({ name: 'questionnaireTemplateId' })
  public questionnaireTemplate?: Relation<QuestionnaireTemplate>;

  @Column({ nullable: false, type: 'varchar' })
  public creatorId: string;

  @Column({ nullable: false, type: 'varchar' })
  public slug: string;

  @Column({ nullable: false, type: 'integer' })
  public version: number;

  @Column({ nullable: false, type: 'integer' })
  public s3Key: string;

  @Column({ nullable: false, type: 'varchar' })
  public fileName: string;

  @Column({ nullable: true, type: 'jsonb' })
  public descriptionAST: SlateAST | null;

  @Column({ nullable: true, type: 'varchar' })
  public descriptionHtml: string | null;

  @Column({ nullable: true, type: 'varchar' })
  public descriptionText: string | null;
}

export default PdfTemplate;
