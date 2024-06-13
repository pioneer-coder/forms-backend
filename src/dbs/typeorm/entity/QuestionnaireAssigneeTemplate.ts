import {
  Entity, Column, ManyToOne, JoinColumn, Relation,
} from 'typeorm';
import BaseEntity from './BaseEntity.js';
import QuestionnaireTemplate from './QuestionnaireTemplate.js';

@Entity({
  name: 'questionnaire_assignee_templates',
})
class QuestionnaireAssigneeTemplate extends BaseEntity {
  @Column({ nullable: false, type: 'varchar' })
  public questionnaireTemplateId: string;

  @ManyToOne(() => QuestionnaireTemplate)
  @JoinColumn({ name: 'questionnaireTemplateId' })
  public questionnaireTemplate?: Relation<QuestionnaireTemplate>;

  @Column({ nullable: false, type: 'varchar' })
  public slug: string;
}

export default QuestionnaireAssigneeTemplate;
