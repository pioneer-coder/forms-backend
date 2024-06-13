import {
  Entity, Column, Relation, JoinColumn, ManyToOne,
} from 'typeorm';
import BaseEntity from './BaseEntity.js';
import QuestionnaireTemplate from './QuestionnaireTemplate.js';

@Entity({
  name: 'questionnaires',
})
class Questionnaire extends BaseEntity {
  @Column({ nullable: false, type: 'varchar' })
  public creatorId: string;

  @Column({ nullable: false, type: 'varchar' })
  public questionnaireTemplateId: string;

  @ManyToOne(() => QuestionnaireTemplate)
  @JoinColumn({ name: 'questionnaireTemplateId' })
  public questionnaireTemplate?: Relation<QuestionnaireTemplate>;

  @Column({ nullable: false, type: 'varchar' })
  public status: 'in-progress' | 'submitted';
}

export default Questionnaire;
