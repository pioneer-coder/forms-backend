import { expect } from 'chai';
import sinon from 'sinon';
import sentry from '@/interfaces/sentry/index.js';
import { getDoubleArgs } from '@test/index.js';
import deserializeQueryItem from './index.js';

describe('utils/deserializeQueryItem', function () {
  describe('type=string', function () {
    type ThisResponse = string | undefined;

    it('should return the string', function () {
      const val: ThisResponse = deserializeQueryItem('true');
      expect(val).to.equal('true');
    });

    it('should return null as undefined', function () {
      const val: ThisResponse = deserializeQueryItem(null);
      expect(val).to.equal(undefined);
    });

    it('should return undefined', function () {
      const val: ThisResponse = deserializeQueryItem(undefined);
      expect(val).to.equal(undefined);
    });

    it('should return ""', function () {
      const val: ThisResponse = deserializeQueryItem('');
      expect(val).to.equal('');
    });

    it('should return the first item in an array of strings', function () {
      const val: ThisResponse = deserializeQueryItem(['foo', 'bar']);
      expect(val).to.equal('foo');
    });

    it('should return undefined for an empty array', function () {
      const val: ThisResponse = deserializeQueryItem([]);
      expect(val).to.equal(undefined);
    });

    it('should work with an explicit type: string', function () {
      const val: ThisResponse = deserializeQueryItem('10', { type: 'string' });
      expect(val).to.equal('10');
    });

    it('should use the default if no value given', function () {
      const val: string = deserializeQueryItem(undefined, { defaultValue: 'the-default', type: 'string' });
      expect(val).to.equal('the-default');
    });

    it('should not use the default if a value is given', function () {
      const val: string = deserializeQueryItem('the-thing', { defaultValue: 'the-default', type: 'string' });
      expect(val).to.equal('the-thing');
    });

    it('should pass through the value if it is in the enums', function () {
      const val = deserializeQueryItem('baz', { enum: ['bar', 'baz'], type: 'string' });
      expect(val).to.equal('baz');
    });

    it('should not call logError if the value is in the list of enums', function () {
      sinon.spy(sentry, 'captureException');
      deserializeQueryItem('bar', { enum: ['bar', 'baz'], type: 'string' });
      expect(sentry.captureException).not.to.have.been.called;
    });

    it('should still pass through, even if it does not match the enum', function () {
      const val: ThisResponse = deserializeQueryItem('foo', { enum: ['bar', 'baz'], type: 'string' });
      expect(val).to.equal('foo');
    });

    it('should call captureException if the value is not in the list of enums', function () {
      sinon.spy(sentry, 'captureException');
      deserializeQueryItem('foo', { enum: ['bar', 'baz'], type: 'string' });
      expect(sentry.captureException).to.have.been.calledOnce;
      const err = getDoubleArgs(sentry.captureException)[0];
      expect(err).to.be.an.instanceOf(Error);
      expect((err as Error).message).to.equal('Value not allowed');
      const context = getDoubleArgs(sentry.captureException)[1];
      expect(context).to.deep.equal({ extra: { enum: ['bar', 'baz'], item: 'foo' } });
    });

    it('should not call logError if the value is null', function () {
      sinon.spy(sentry, 'captureException');
      deserializeQueryItem(null, { enum: ['bar', 'baz'], type: 'string' });
      expect(sentry.captureException).not.to.have.been.called;
    });

    it('should not call logError if the value is undefined', function () {
      sinon.spy(sentry, 'captureException');
      deserializeQueryItem(undefined, { enum: ['bar', 'baz'], type: 'string' });
      expect(sentry.captureException).not.to.have.been.called;
    });

    it('should set the type properly', function () {
      type Choice = 'option1' | 'option2';
      const val: Choice | undefined = deserializeQueryItem<Choice>('option1', { enum: ['option1', 'option2'], type: 'string' });
      expect(val).to.equal('option1');
    });

    it('should allow the input to be "undefined"', function () {
      const val: ThisResponse = deserializeQueryItem('undefined');
      expect(val).to.equal('undefined');
    });

    it('should allow the input to be "null"', function () {
      const val: ThisResponse = deserializeQueryItem('null');
      expect(val).to.equal('null');
    });
  });

  describe('type=enum', function () {
    enum TestEnum {
      foo = 'foo',
      bar = 'bar',
    }
    type ThisResponse = TestEnum | undefined;

    it('should pass through TestEnum.foo', function () {
      const val: ThisResponse = deserializeQueryItem(TestEnum.foo, { enum: TestEnum, type: 'enum' });
      expect(val).to.equal('foo');
    });

    it('should pass through "foo"', function () {
      const val: ThisResponse = deserializeQueryItem('foo', { enum: TestEnum, type: 'enum' });
      expect(val).to.equal('foo');
    });

    it('should pass through undefined', function () {
      const val: ThisResponse = deserializeQueryItem(undefined, { enum: TestEnum, type: 'enum' });
      expect(val).to.equal(undefined);
    });

    it('should convert null to undefined', function () {
      const val: ThisResponse = deserializeQueryItem(null, { enum: TestEnum, type: 'enum' });
      expect(val).to.equal(undefined);
    });

    it('should use the default if no value given', function () {
      const val: TestEnum = deserializeQueryItem(null, { defaultValue: TestEnum.bar, enum: TestEnum, type: 'enum' });
      expect(val).to.be.equal(TestEnum.bar);
    });

    it('should not use the default if a value is given', function () {
      const val: TestEnum = deserializeQueryItem(TestEnum.foo, { defaultValue: TestEnum.bar, enum: TestEnum, type: 'enum' });
      expect(val).to.be.equal(TestEnum.foo);
    });

    it('should not call logError if the value is valide', function () {
      sinon.spy(sentry, 'captureException');
      deserializeQueryItem('foo', { enum: TestEnum, type: 'enum' });
      expect(sentry.captureException).not.to.have.been.called;
    });

    it('should pass through "notfoo"', function () {
      const val: ThisResponse = deserializeQueryItem('notfoo', { enum: TestEnum, type: 'enum' });
      expect(val).to.equal('notfoo');
    });

    it('should call captureException if the value is not in the enum', function () {
      sinon.spy(sentry, 'captureException');
      deserializeQueryItem('notfoo', { enum: TestEnum, type: 'enum' });
      expect(sentry.captureException).to.have.been.calledOnce;
      const err = getDoubleArgs(sentry.captureException)[0];
      expect(err).to.be.an.instanceOf(Error);
      expect((err as Error).message).to.equal('Not in enum');
      const context = getDoubleArgs(sentry.captureException)[1];
      expect(context).to.deep.equal({ extra: { enum: TestEnum, item: 'notfoo' } });
    });

    it('should treat "undefined" as undefined if it is not in the enum', function () {
      const val: ThisResponse = deserializeQueryItem('undefined', { enum: TestEnum, type: 'enum' });
      expect(val).to.equal(undefined);
    });

    it('should treat "undefined" as a string if it is not in the enum', function () {
      enum WithUndefined {
        undefined = 'undefined',
      }
      const val: WithUndefined | undefined = deserializeQueryItem('undefined', { enum: WithUndefined, type: 'enum' });
      expect(val).to.equal('undefined');
    });

    it('should treat "null" as null if it is not in the enum', function () {
      const val: ThisResponse = deserializeQueryItem('null', { enum: TestEnum, type: 'enum' });
      expect(val).to.equal(undefined);
    });

    it('should treat "null" as a string if it is not in the enum', function () {
      enum WithNull {
        null = 'null',
      }
      const val: WithNull | undefined = deserializeQueryItem('null', { enum: WithNull, type: 'enum' });
      expect(val).to.equal('null');
    });
  });

  describe('type=boolean', function () {
    type ThisResponse = boolean | undefined;

    it('should convert "true" to true', function () {
      const val: ThisResponse = deserializeQueryItem('true', { type: 'boolean' });
      expect(val).to.equal(true);
    });

    it('should convert ["true", "false"] to true', function () {
      const val: ThisResponse = deserializeQueryItem(['true', 'false'], { type: 'boolean' });
      expect(val).to.equal(true);
    });

    it('should convert "false" to false', function () {
      const val: ThisResponse = deserializeQueryItem('false', { type: 'boolean' });
      expect(val).to.equal(false);
    });

    it('should convert "blah" to false', function () {
      const val: ThisResponse = deserializeQueryItem('blah', { type: 'boolean' });
      expect(val).to.equal(false);
    });

    it('should use the default if no value given', function () {
      const val: boolean = deserializeQueryItem(undefined, { defaultValue: true, type: 'boolean' });
      expect(val).to.equal(true);
    });

    it('should not use the default if a value is given', function () {
      const val: boolean = deserializeQueryItem('false', { defaultValue: true, type: 'boolean' });
      expect(val).to.equal(false);
    });

    it('should call captureException for "blah', function () {
      sinon.spy(sentry, 'captureException');
      deserializeQueryItem('blah', { type: 'boolean' });
      expect(sentry.captureException).to.have.been.calledOnce;
      const err = getDoubleArgs(sentry.captureException)[0];
      expect(err).to.be.an.instanceOf(Error);
      expect((err as Error).message).to.equal('Problem trying to deserialize boolean');
      const context = getDoubleArgs(sentry.captureException)[1];
      expect(context).to.deep.equal({ extra: { item: 'blah' } });
    });

    it('should convert [] to undefined', function () {
      const val: ThisResponse = deserializeQueryItem([], { type: 'boolean' });
      expect(val).to.equal(undefined);
    });

    it('should treat "undefined" as undefined', function () {
      const val: ThisResponse = deserializeQueryItem('undefined', { type: 'boolean' });
      expect(val).to.equal(undefined);
    });

    it('should treat "null" as null', function () {
      const val: ThisResponse = deserializeQueryItem('null', { type: 'boolean' });
      expect(val).to.equal(undefined);
    });
  });

  describe('type=integer', function () {
    type ThisResponse = number | undefined;

    it('should convert "" to undefined', function () {
      const val: ThisResponse = deserializeQueryItem('', { type: 'integer' });
      expect(val).to.equal(undefined);
    });

    it('should convert "10" to 10', function () {
      const val: ThisResponse = deserializeQueryItem('10', { type: 'integer' });
      expect(val).to.equal(10);
    });

    it('should convert "-34" to -34', function () {
      const val: ThisResponse = deserializeQueryItem('-34', { type: 'integer' });
      expect(val).to.equal(-34);
    });

    it('should convert ["11", "12"] to 11', function () {
      const val: ThisResponse = deserializeQueryItem(['11', '12'], { type: 'integer' });
      expect(val).to.equal(11);
    });

    it('should round "4.501" to 5', function () {
      const val: ThisResponse = deserializeQueryItem('4.501', { type: 'integer' });
      expect(val).to.equal(5);
    });

    it('should convert "4.59" to 4', function () {
      const val: ThisResponse = deserializeQueryItem('4.49', { type: 'integer' });
      expect(val).to.equal(4);
    });

    it('should cap at the max', function () {
      const val: ThisResponse = deserializeQueryItem('21', { max: 10, type: 'integer' });
      expect(val).to.equal(10);
    });

    it('should cap at the max, even when negative', function () {
      const val: ThisResponse = deserializeQueryItem('-4', { max: -5, type: 'integer' });
      expect(val).to.equal(-5);
    });

    it('should cap at the min', function () {
      const val: ThisResponse = deserializeQueryItem('21', { min: 25, type: 'integer' });
      expect(val).to.equal(25);
    });

    it('should cap at the min, even when negative', function () {
      const val: ThisResponse = deserializeQueryItem('-4', { min: -3, type: 'integer' });
      expect(val).to.equal(-3);
    });

    it('should stop parsing at the first non number', function () {
      const val: ThisResponse = deserializeQueryItem('454abcd33', { type: 'integer' });
      expect(val).to.equal(454);
    });

    it('should return undefined for a non-parsable string "blah"', function () {
      const val: ThisResponse = deserializeQueryItem('blah', { type: 'integer' });
      expect(val).to.equal(undefined);
    });

    it('should use the default for undefined', function () {
      const val: number = deserializeQueryItem(undefined, { defaultValue: 4, type: 'integer' });
      expect(val).to.equal(4);
    });

    it('should use the default for null', function () {
      const val: number = deserializeQueryItem(null, { defaultValue: -3, type: 'integer' });
      expect(val).to.equal(-3);
    });

    it('should use the default for unparsable', function () {
      const val: number = deserializeQueryItem('blah', { defaultValue: 6, type: 'integer' });
      expect(val).to.equal(6);
    });

    it('should round the defaultValue', function () {
      const val: number = deserializeQueryItem(undefined, { defaultValue: 6.4, type: 'integer' });
      expect(val).to.equal(6);
    });

    it('should not use the default if a value is given', function () {
      const val: number = deserializeQueryItem('3', { defaultValue: 4, type: 'integer' });
      expect(val).to.equal(3);
    });

    it('should call captureException for and return min if the default is less than the min', function () {
      sinon.spy(sentry, 'captureException');
      // val: number is to check that typescripting is correct
      const val: number = deserializeQueryItem(undefined, { defaultValue: 5, min: 10, type: 'integer' });
      expect(val).to.equal(10);
      expect(sentry.captureException).to.have.been.calledOnce;
      const err = getDoubleArgs(sentry.captureException)[0];
      expect(err).to.be.an.instanceOf(Error);
      expect((err as Error).message).to.equal('Problem trying to deserialize integer, default out of range');
      const context = getDoubleArgs(sentry.captureException)[1];
      expect(context).to.deep.equal({
        extra: {
          defaultValue: 5, item: undefined, max: null, min: 10,
        },
      });
    });

    it('should call captureException for and return max if the default is greater than the max', function () {
      sinon.spy(sentry, 'captureException');
      const val: number = deserializeQueryItem(undefined, { defaultValue: 25, max: 10, type: 'integer' });
      expect(val).to.equal(10);
      expect(sentry.captureException).to.have.been.calledOnce;
      const err = getDoubleArgs(sentry.captureException)[0];
      expect(err).to.be.an.instanceOf(Error);
      expect((err as Error).message).to.equal('Problem trying to deserialize integer, default out of range');
      const context = getDoubleArgs(sentry.captureException)[1];
      expect(context).to.deep.equal({
        extra: {
          defaultValue: 25, item: undefined, max: 10, min: null,
        },
      });
    });

    it('should call captureException for an un-parseable string', function () {
      sinon.spy(sentry, 'captureException');
      deserializeQueryItem('blah', { type: 'integer' });
      expect(sentry.captureException).to.have.been.calledOnce;
      const err = getDoubleArgs(sentry.captureException)[0];
      expect(err).to.be.an.instanceOf(Error);
      expect((err as Error).message).to.equal('Problem trying to deserialize integer');
      const context = getDoubleArgs(sentry.captureException)[1];
      expect(context).to.deep.equal({ extra: { item: 'blah' } });
    });

    it('should call captureException if the min is greater than the max', function () {
      sinon.spy(sentry, 'captureException');
      deserializeQueryItem('7', { max: 5, min: 10, type: 'integer' });
      expect(sentry.captureException).to.have.been.calledOnce;
      const err = getDoubleArgs(sentry.captureException)[0];
      expect(err).to.be.an.instanceOf(Error);
      expect((err as Error).message).to.equal('Problem trying to deserialize integer, max less than min');
      const context = getDoubleArgs(sentry.captureException)[1];
      expect(context).to.deep.equal({ extra: { item: '7', max: 5, min: 10 } });
    });

    it('should convert [] to undefined', function () {
      const val: ThisResponse = deserializeQueryItem([], { type: 'integer' });
      expect(val).to.equal(undefined);
    });

    it('should treat "undefined" as undefined', function () {
      const val: ThisResponse = deserializeQueryItem('undefined', { type: 'integer' });
      expect(val).to.equal(undefined);
    });

    it('should treat "null" as null', function () {
      const val: ThisResponse = deserializeQueryItem('null', { type: 'integer' });
      expect(val).to.equal(undefined);
    });
  });

  describe('type=float', function () {
    type ThisResponse = number | undefined;

    it('should convert "" to undefined', function () {
      const val: ThisResponse = deserializeQueryItem('', { type: 'float' });
      expect(val).to.equal(undefined);
    });

    it('should convert "10.1" to 10.1', function () {
      const val: ThisResponse = deserializeQueryItem('10.1', { type: 'float' });
      expect(val).to.equal(10.1);
    });

    it('should convert "-34" to -34', function () {
      const val: ThisResponse = deserializeQueryItem('-34', { type: 'float' });
      expect(val).to.equal(-34);
    });

    it('should convert ["11.99", "12.01"] to 11.99', function () {
      const val: ThisResponse = deserializeQueryItem(['11.99', '12.01'], { type: 'float' });
      expect(val).to.equal(11.99);
    });

    it('should cap at the max', function () {
      const val: ThisResponse = deserializeQueryItem('21', { max: 10, type: 'float' });
      expect(val).to.equal(10);
    });

    it('should cap at the max, even when negative', function () {
      const val: ThisResponse = deserializeQueryItem('-4', { max: -5, type: 'float' });
      expect(val).to.equal(-5);
    });

    it('should cap at the min', function () {
      const val: ThisResponse = deserializeQueryItem('21', { min: 25, type: 'float' });
      expect(val).to.equal(25);
    });

    it('should cap at the min, even when negative', function () {
      const val: ThisResponse = deserializeQueryItem('-4', { min: -3, type: 'float' });
      expect(val).to.equal(-3);
    });

    it('should stop parsing at the first non number', function () {
      const val: ThisResponse = deserializeQueryItem('454abcd33', { type: 'float' });
      expect(val).to.equal(454);
    });

    it('should return undefined for a non-parsable string "blah"', function () {
      const val: ThisResponse = deserializeQueryItem('blah', { type: 'float' });
      expect(val).to.equal(undefined);
    });

    it('should use the default for undefined', function () {
      const val: number = deserializeQueryItem(undefined, { defaultValue: 4.5, type: 'float' });
      expect(val).to.equal(4.5);
    });

    it('should use the default for null', function () {
      const val: number = deserializeQueryItem(null, { defaultValue: -3, type: 'float' });
      expect(val).to.equal(-3);
    });

    it('should use the default for unparsable', function () {
      const val: number = deserializeQueryItem('blah', { defaultValue: 6, type: 'float' });
      expect(val).to.equal(6);
    });

    it('should not use the default if a value is given', function () {
      const val: number = deserializeQueryItem('3', { defaultValue: 4, type: 'float' });
      expect(val).to.equal(3);
    });

    it('should call captureException for and return min if the default is less than the min', function () {
      sinon.spy(sentry, 'captureException');
      // val: number is to check that typescripting is correct
      const val: number = deserializeQueryItem(undefined, { defaultValue: 5, min: 10, type: 'float' });
      expect(val).to.equal(10);
      expect(sentry.captureException).to.have.been.calledOnce;
      const err = getDoubleArgs(sentry.captureException)[0];
      expect(err).to.be.an.instanceOf(Error);
      expect((err as Error).message).to.equal('Problem trying to deserialize integer, default out of range');
      const context = getDoubleArgs(sentry.captureException)[1];
      expect(context).to.deep.equal({
        extra: {
          defaultValue: 5, item: undefined, max: null, min: 10,
        },
      });
    });

    it('should call captureException for and return max if the default is greater than the max', function () {
      sinon.spy(sentry, 'captureException');
      const val: number = deserializeQueryItem(undefined, { defaultValue: 25, max: 10, type: 'float' });
      expect(val).to.equal(10);
      expect(sentry.captureException).to.have.been.calledOnce;
      const err = getDoubleArgs(sentry.captureException)[0];
      expect(err).to.be.an.instanceOf(Error);
      expect((err as Error).message).to.equal('Problem trying to deserialize integer, default out of range');
      const context = getDoubleArgs(sentry.captureException)[1];
      expect(context).to.deep.equal({
        extra: {
          defaultValue: 25, item: undefined, max: 10, min: null,
        },
      });
    });

    it('should call captureException for an un-parseable string', function () {
      sinon.spy(sentry, 'captureException');
      deserializeQueryItem('blah', { type: 'float' });
      expect(sentry.captureException).to.have.been.calledOnce;
      const err = getDoubleArgs(sentry.captureException)[0];
      expect(err).to.be.an.instanceOf(Error);
      expect((err as Error).message).to.equal('Problem trying to deserialize integer');
      const context = getDoubleArgs(sentry.captureException)[1];
      expect(context).to.deep.equal({ extra: { item: 'blah' } });
    });

    it('should call captureException if the min is greater than the max', function () {
      sinon.spy(sentry, 'captureException');
      deserializeQueryItem('7', { max: 5, min: 10, type: 'float' });
      expect(sentry.captureException).to.have.been.calledOnce;
      const err = getDoubleArgs(sentry.captureException)[0];
      expect(err).to.be.an.instanceOf(Error);
      expect((err as Error).message).to.equal('Problem trying to deserialize integer, max less than min');
      const context = getDoubleArgs(sentry.captureException)[1];
      expect(context).to.deep.equal({ extra: { item: '7', max: 5, min: 10 } });
    });

    it('should convert [] to undefined', function () {
      const val: ThisResponse = deserializeQueryItem([], { type: 'float' });
      expect(val).to.equal(undefined);
    });

    it('should treat "undefined" as undefined', function () {
      const val: ThisResponse = deserializeQueryItem('undefined', { type: 'float' });
      expect(val).to.equal(undefined);
    });

    it('should treat "null" as null', function () {
      const val: ThisResponse = deserializeQueryItem('null', { type: 'float' });
      expect(val).to.equal(undefined);
    });
  });

  describe('type=date', function () {
    it('should just pass "2023-05-11" on', function () {
      const val = deserializeQueryItem('2023-05-11', { type: 'date' });
      expect(val).to.equal('2023-05-11');
    });

    it('should use the first date in an array ["2023-04-11", "2023-05-11"]', function () {
      const val = deserializeQueryItem(['2023-04-11', '2023-05-11'], { type: 'date' });
      expect(val).to.equal('2023-04-11');
    });

    it('should ignore "blah"', function () {
      const val = deserializeQueryItem('blah', { type: 'date' });
      expect(val).to.equal(undefined);
    });

    it('should use the default if no value given', function () {
      const val = deserializeQueryItem(undefined, { defaultValue: '2023-01-03', type: 'date' });
      expect(val).to.equal('2023-01-03');
    });

    it('should convert a datetime to a date string', function () {
      const val = deserializeQueryItem('2023-05-11T22:40:59.083Z', { type: 'date' });
      expect(val).to.equal('2023-05-11');
    });

    it('should not use the default if a value is given', function () {
      const val = deserializeQueryItem('2022-12-03', { defaultValue: '2023-01-03', type: 'date' });
      expect(val).to.equal('2022-12-03');
    });

    it('should call captureException for "blah', function () {
      sinon.spy(sentry, 'captureException');
      deserializeQueryItem('blah', { type: 'date' });
      expect(sentry.captureException).to.have.been.calledOnce;
      const err = getDoubleArgs(sentry.captureException)[0];
      expect(err).to.be.an.instanceOf(Error);
      expect((err as Error).message).to.equal('Problem trying to deserialize date');
      const context = getDoubleArgs(sentry.captureException)[1];
      expect(context).to.deep.equal({ extra: { item: 'blah' } });
    });

    it('should convert [] to undefined', function () {
      const val = deserializeQueryItem([], { type: 'date' });
      expect(val).to.equal(undefined);
    });

    it('should treat "undefined" as undefined', function () {
      const val = deserializeQueryItem('undefined', { type: 'date' });
      expect(val).to.equal(undefined);
    });

    it('should treat "null" as null', function () {
      const val = deserializeQueryItem('null', { type: 'date' });
      expect(val).to.equal(undefined);
    });
  });

  describe('type=unknown', function () {
    type ThisResponse = string | undefined;

    it('should treat it like "string"', function () {
      const val: ThisResponse = deserializeQueryItem('false', { type: 'unknown' as 'string' });
      expect(val).to.equal('false');
    });

    it('should call captureException', function () {
      sinon.spy(sentry, 'captureException');
      deserializeQueryItem('oops', { type: 'unknown' as 'string' });
      expect(sentry.captureException).to.have.been.calledOnce;
      const err = getDoubleArgs(sentry.captureException)[0];
      expect(err).to.be.an.instanceOf(Error);
      expect((err as Error).message).to.equal('Invalid type');
      const context = getDoubleArgs(sentry.captureException)[1];
      expect(context).to.deep.equal({ extra: { item: 'oops', type: 'unknown' } });
    });
  });
});
