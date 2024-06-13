import {
  Entity, Column, ManyToOne, JoinColumn, Relation,
} from 'typeorm';
import BaseEntity from './BaseEntity.js';
import FieldTemplate from './FieldTemplate.js';
import QuestionnaireAssigneeTemplate from './QuestionnaireAssigneeTemplate.js';

@Entity({
  name: 'field_assignee_templates',
})
class FieldAssigneeTemplate extends BaseEntity {
  @Column({ nullable: false, type: 'varchar' })
  public questionnaireAssigneeTemplateId: string;

  @ManyToOne(() => QuestionnaireAssigneeTemplate)
  @JoinColumn({ name: 'questionnaireAssigneeTemplateId' })
  public questionnaireAssigneeTemplate?: Relation<QuestionnaireAssigneeTemplate>;

  @Column({ nullable: false, type: 'varchar' })
  public fieldTemplateId: string;

  @ManyToOne(() => FieldTemplate)
  @JoinColumn({ name: 'fieldTemplateId' })
  public fieldTemplate?: Relation<FieldTemplate> | null;
}

export default FieldAssigneeTemplate;
