/* eslint-disable mocha/no-skipped-tests */
import { expect } from 'chai';
import { nanoid } from 'nanoid';
import { doubleReturns, fixtures, getAsyncThrownError } from '@test/index.js';
import { pgRepositories } from '@/dbs/typeorm/index.js';
import noodleApi from '@/interfaces/noodleApi/index.js';
import ForbiddenError from '@/errors/ForbiddenError.js';
import quetionnaireResponseService from './index.js';

describe('services/questionnaireResponse', function () {
  describe('.update', function () {
    beforeEach(async function () {
      const creator = fixtures.creator();
      const customer = { id: nanoid() };

      const questionnaireTemplate = await fixtures.questionnaireTemplate({
        creatorId: creator.id,
      });
      const sectionTemplate = await fixtures.sectionTemplate({
        questionnaireTemplateId: questionnaireTemplate.id,
      });
      const fieldTemplate = await fixtures.fieldTemplate({
        questionnaireTemplateId: questionnaireTemplate.id,
        sectionTemplateId: sectionTemplate.id,
      });
      const questionnaireAssigneeTemplate = await fixtures.questionnaireAssigneeTemplate({
        questionnaireTemplateId: questionnaireTemplate.id,
      });
      await fixtures.fieldAssigneeTemplate({
        fieldTemplateId: fieldTemplate.id,
        questionnaireAssigneeTemplateId: questionnaireAssigneeTemplate.id,
      });

      // instance
      const questionnaire = await fixtures.questionnaire({
        creatorId: creator.id,
        questionnaireTemplateId: questionnaireTemplate.id,
      });
      await fixtures.questionnaireAssignee({
        personId: customer.id,
        questionnaireAssigneeTemplateId: questionnaireAssigneeTemplate.id,
        questionnaireId: questionnaire.id,
      });

      doubleReturns(noodleApi.hasCreatorPermissions, false);

      this.customer = customer;
      this.questionnaire = questionnaire;
      this.fieldTemplate = fieldTemplate;
    });

    it('should let an assignee submit an answer', async function () {
      const error = await getAsyncThrownError(quetionnaireResponseService.updateQuestionnaireResponses({
        questionnaireId: this.questionnaire.id,
        requester: { id: this.customer.id },
        responses: [{
          fieldTemplateId: this.fieldTemplate.id,
          key: this.fieldTemplate.key,
          value: 'Something',
        }],
      }));

      expect(error).to.be.undefined;
    });

    it('should let a creator team member submit an answer', async function () {
      const teamMemberPersonId = nanoid();
      doubleReturns(noodleApi.hasCreatorPermissions, true);

      const error = await getAsyncThrownError(quetionnaireResponseService.updateQuestionnaireResponses({
        questionnaireId: this.questionnaire.id,
        requester: { id: teamMemberPersonId },
        responses: [{
          fieldTemplateId: this.fieldTemplate.id,
          key: this.fieldTemplate.key,
          value: 'Something',
        }],
      }));

      expect(error).to.be.undefined;
    });

    it('should not let a random person submit an answer', async function () {
      const otherPersonId = nanoid();

      const error = await getAsyncThrownError(quetionnaireResponseService.updateQuestionnaireResponses({
        questionnaireId: this.questionnaire.id,
        requester: { id: otherPersonId },
        responses: [{
          fieldTemplateId: this.fieldTemplate.id,
          key: this.fieldTemplate.key,
          value: 'Something',
        }],
      }));

      expect(error).to.be.an.instanceOf(ForbiddenError);
    });

    it('should save the short-text response', async function () {
      await quetionnaireResponseService.updateQuestionnaireResponses({
        questionnaireId: this.questionnaire.id,
        requester: { id: this.customer.id },
        responses: [{
          fieldTemplateId: this.fieldTemplate.id,
          key: this.fieldTemplate.key,
          value: 'Something',
        }],
      });

      const reloaded = await pgRepositories.questionnaireResponse.findOneBy({
        fieldTemplateId: this.fieldTemplate.id,
        questionnaireId: this.questionnaire.id,
      });
      expect(reloaded?.value).to.equal('Something');
    });

    it('should save the name response', async function () {
      this.fieldTemplate.type = 'name';
      await pgRepositories.fieldTemplate.save(this.fieldTemplate);

      await quetionnaireResponseService.updateQuestionnaireResponses({
        questionnaireId: this.questionnaire.id,
        requester: { id: this.customer.id },
        responses: [{
          fieldTemplateId: this.fieldTemplate.id,
          key: this.fieldTemplate.key,
          value: {
            firstName: 'Jane',
            lastName: 'Doe',
            middleName: '',
          },
        }],
      });

      const reloaded = await pgRepositories.questionnaireResponse.findOneBy({
        fieldTemplateId: this.fieldTemplate.id,
        questionnaireId: this.questionnaire.id,
      });
      expect(reloaded?.value).to.deep.equal({
        firstName: 'Jane',
        lastName: 'Doe',
        middleName: '',
      });
    });

    it.skip('should overrite an existing value', async function () {
      const existingResponse = await fixtures.questionnaireResponse({
        fieldTemplateId: this.fieldTemplate.id,
        questionnaireId: this.questionnaire.id,
        value: 'Old value',
      });

      await quetionnaireResponseService.updateQuestionnaireResponses({
        questionnaireId: this.questionnaire.id,
        requester: { id: this.customer.id },
        responses: [{
          fieldTemplateId: this.fieldTemplate.id,
          key: this.fieldTemplate.key,
          value: 'New value',
        }],
      });

      const reloaded = await pgRepositories.questionnaireResponse.findOneBy({
        fieldTemplateId: this.fieldTemplate.id,
        questionnaireId: this.questionnaire.id,
      });
      expect(reloaded?.id).to.equal(existingResponse.id);
      expect(reloaded?.value).to.equal('New value');
    });

    it.skip('should overrite an existing value, even if the type changes', async function () {
      const existingResponse = await fixtures.questionnaireResponse({
        fieldTemplateId: this.fieldTemplate.id,
        questionnaireId: this.questionnaire.id,
        value: 'Jane ShortText Doe',
      });

      await fixtures.fieldTemplate({
        key: this.fieldTemplate.key,
        questionnaireTemplateId: this.fieldTemplate.questionnaireTemplateId,
        sectionTemplateId: this.fieldTemplate.sectionTemplateId,
        type: 'name',
      });

      await quetionnaireResponseService.updateQuestionnaireResponses({
        questionnaireId: this.questionnaire.id,
        requester: { id: this.customer.id },
        responses: [{
          fieldTemplateId: this.fieldTemplate.id,
          key: this.fieldTemplate.key,
          value: {
            firstName: 'Jane',
            lastName: 'Doe',
            middleName: 'Object',
          },
        }],
      });

      const reloaded = await pgRepositories.questionnaireResponse.findOneBy({
        fieldTemplateId: this.fieldTemplate.id,
        questionnaireId: this.questionnaire.id,
      });
      expect(reloaded?.id).to.equal(existingResponse.id);
      expect(reloaded?.value).to.equal('New value');
    });
  });
});
