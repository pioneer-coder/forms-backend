import {
  Entity,
  Column,
  Relation,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import BaseEntity from './BaseEntity.js';
import FieldTemplate from './FieldTemplate.js';

@Entity({
  name: 'questionnaire_responses',
})
class QuestionnaireResponse extends BaseEntity {
  @Column({ nullable: false, type: 'varchar' })
  public questionnaireId: string;

  @Column({ nullable: false, type: 'varchar' })
  public submittedById: string;

  @Column({ nullable: false, type: 'varchar' })
  public fieldTemplateId: string;

  @ManyToOne(() => FieldTemplate)
  @JoinColumn({ name: 'fieldTemplateId' })
  public fieldTemplate?: Relation<FieldTemplate>;

  @Column({ nullable: true, type: 'jsonb' })
  public value: unknown | null; // different for every type
}

export default QuestionnaireResponse;
