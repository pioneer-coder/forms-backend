import { expect } from 'chai';
import serializeToPlainText from './index.js';

describe('utils/slate/serializeToPlainText', function () {
  it('should just return text', function () {
    expect(serializeToPlainText({ text: 'bare text' })).to.equal(
      'bare text',
    );
  });

  it('should convert a paragraph', function () {
    expect(serializeToPlainText({
      children: [{
        children: [{ text: 'some message' }],
        type: 'paragraph',
      }],
    })).to.equal(
      'some message',
    );
  });

  it('should join multiple paragraphs', function () {
    expect(serializeToPlainText({
      children: [
        {
          children: [
            {
              text: 'Hello!!!',
            },
          ],
          type: 'paragraph',
        },
        {
          children: [
            {
              text: 'Second Line!!!',
            },
          ],
          type: 'paragraph',
        },
      ],
    })).to.equal(
      'Hello!!!\nSecond Line!!!',
    );
  });

  it('should replace new lines with actual new lines', function () {
    expect(serializeToPlainText({
      children: [
        {
          children: [
            {
              text: 'Attach audio\n',
            },
          ],
          type: 'paragraph',
        },
      ],
    })).to.equal('Attach audio\n');
  });

  it('should replace multiple new lines with <br> tags', function () {
    expect(serializeToPlainText({
      children: [
        {
          children: [
            {
              text: 'bvbvvcbvcbvcbvcb\n\n\nfdsfdsfdsfdsf\n\ngdf',
            },
          ],
          type: 'paragraph',
        },
      ],
    })).to.equal('bvbvvcbvcbvcbvcb\n\n\nfdsfdsfdsfdsf\n\ngdf');
  });
});
