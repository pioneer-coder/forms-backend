import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import BaseEntity from './BaseEntity.js';
import PdfTemplate from './PdfTemplate.js';

@Entity({
  name: 'pdf_field_templates',
})
class PdfFieldTemplate extends BaseEntity {
  @Column({ nullable: false, type: 'varchar' })
  public pdfTemplateId: string;

  @ManyToOne(() => PdfTemplate)
  @JoinColumn({ name: 'pdfTemplateId' })
  public pdfTemplate?: Relation<PdfTemplate>;

  @Column({ nullable: false, type: 'varchar' })
  public key: string;

  @Column({ nullable: true, type: 'jsonb' })
  public data: Record<string, unknown> | null;

  @Column({ nullable: false, type: 'integer' })
  public page: number;

  @Column({ nullable: false, type: 'float' })
  public positionX: number;

  @Column({ nullable: false, type: 'float' })
  public positionY: number;

  @Column({ nullable: false, type: 'float' })
  public positionHeight: number;

  @Column({ nullable: false, type: 'float' })
  public positionWidth: number;
}

export default PdfFieldTemplate;
