import {
  Entity,
  Column,
} from 'typeorm';
import BaseEntity from './BaseEntity.js';

@Entity({
  name: 'questionnaire_assignees',
})
class QuestionnaireAssignee extends BaseEntity {
  @Column({ nullable: false, type: 'varchar' })
  public questionnaireId: string;

  @Column({ nullable: false, type: 'varchar' })
  public questionnaireAssigneeTemplateId: string;

  @Column({ nullable: false, type: 'varchar' })
  public personId: string;
}

export default QuestionnaireAssignee;
