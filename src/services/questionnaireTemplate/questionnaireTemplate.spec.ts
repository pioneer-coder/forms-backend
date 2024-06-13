import { fixtures } from '@test/index.js';

import questionnaireTemplateService from '@/services/questionnaireTemplate/index.js';
import { expect } from 'chai';

describe('services/questionnaireTemplate', function () {
  describe('.getQuestionnaireTemplate', function () {
    beforeEach(async function () {
      const questionnaireTemplate = await fixtures.questionnaireTemplate();
      const sectionTemplate = await fixtures.sectionTemplate({
        questionnaireTemplateId: questionnaireTemplate.id,
      });

      const fieldTemplate = await fixtures.fieldTemplate({
        questionnaireTemplateId: questionnaireTemplate.id,
        sectionTemplateId: sectionTemplate.id,
      });

      this.questionnaireTemplate = questionnaireTemplate;
      this.sectionTemplate = sectionTemplate;
      this.fieldTemplate = fieldTemplate;
    });

    it('should include items in the list, not at the top', async function () {
      this.fieldTemplate.type = 'list';
      const subField1 = await fixtures.fieldTemplate({
        listFieldTemplateId: this.fieldTemplate.id,
        questionnaireTemplateId: this.fieldTemplate.questionnaireTemplateId,
        sectionTemplateId: this.fieldTemplate.sectionTemplateId,
      });
      const subField2 = await fixtures.fieldTemplate({
        listFieldTemplateId: this.fieldTemplate.id,
        questionnaireTemplateId: this.fieldTemplate.questionnaireTemplateId,
        sectionTemplateId: this.fieldTemplate.sectionTemplateId,
      });

      const questionnaireTemplate = await questionnaireTemplateService.getQuestionnaireTemplate({
        questionnaireTemplateId: this.questionnaireTemplate.id,
      });

      const fieldTemplates = questionnaireTemplate?.sectionTemplates?.[0]?.fieldTemplates;

      const fieldTemplateIds = fieldTemplates?.map((f) => f.id);
      expect(fieldTemplateIds).to.be.ok;
      expect(fieldTemplateIds).not.to.include(subField1.id);
      expect(fieldTemplateIds).not.to.include(subField2.id);

      const subFieldTemplateIds = fieldTemplates?.[0]?.listItemTemplates?.map((f) => f.id);
      expect(subFieldTemplateIds).to.be.ok;
      expect(subFieldTemplateIds).to.include(subField1.id);
      expect(subFieldTemplateIds).to.include(subField2.id);
    });

    it('should include items in the list, nested', async function () {
      this.fieldTemplate.type = 'list';
      const subField1 = await fixtures.fieldTemplate({
        listFieldTemplateId: this.fieldTemplate.id,
        questionnaireTemplateId: this.fieldTemplate.questionnaireTemplateId,
        sectionTemplateId: this.fieldTemplate.sectionTemplateId,
      });
      const subField2 = await fixtures.fieldTemplate({
        listFieldTemplateId: this.fieldTemplate.id,
        questionnaireTemplateId: this.fieldTemplate.questionnaireTemplateId,
        sectionTemplateId: this.fieldTemplate.sectionTemplateId,
        type: 'list',
      });
      const subField3 = await fixtures.fieldTemplate({
        listFieldTemplateId: subField2.id,
        questionnaireTemplateId: this.fieldTemplate.questionnaireTemplateId,
        sectionTemplateId: this.fieldTemplate.sectionTemplateId,
        type: 'list',
      });

      const questionnaireTemplate = await questionnaireTemplateService.getQuestionnaireTemplate({
        questionnaireTemplateId: this.questionnaireTemplate.id,
      });

      const fieldTemplates = questionnaireTemplate?.sectionTemplates?.[0]?.fieldTemplates;

      const fieldTemplateIds = fieldTemplates?.map((f) => f.id);
      expect(fieldTemplateIds).to.be.ok;
      expect(fieldTemplateIds).not.to.include(subField1.id);
      expect(fieldTemplateIds).not.to.include(subField2.id);
      expect(fieldTemplateIds).not.to.include(subField3.id);

      const subFieldTemplateIds = fieldTemplates?.[0]?.listItemTemplates?.map((f) => f.id);
      expect(subFieldTemplateIds).to.be.ok;
      expect(subFieldTemplateIds).to.include(subField1.id);
      expect(subFieldTemplateIds).to.include(subField2.id);
    });
  });
});
