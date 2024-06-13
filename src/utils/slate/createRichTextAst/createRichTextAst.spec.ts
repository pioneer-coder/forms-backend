import { expect } from 'chai';
import createRichTextAst from './index.js';

describe('@utils/slate/createRichTextAst', function () {
  it('should create a paragraph from one line', function () {
    expect(createRichTextAst('Hello world')).to.deep.equal({
      children: [
        {
          children: [
            { text: 'Hello world' },
          ],
          type: 'paragraph',
        },
      ],
    });
  });

  it('should create a paragraph for each line', function () {
    expect(createRichTextAst('Hello world', 'How are you?')).to.deep.equal({
      children: [
        {
          children: [
            { text: 'Hello world' },
          ],
          type: 'paragraph',
        },
        {
          children: [
            { text: 'How are you?' },
          ],
          type: 'paragraph',
        },
      ],
    });
  });

  it('should preserve new lines in the string (maybe shouldn\'t but that\'s for later)', function () {
    expect(createRichTextAst('Hello world\nHow are you?')).to.deep.equal({
      children: [
        {
          children: [
            { text: 'Hello world\nHow are you?' },
          ],
          type: 'paragraph',
        },
      ],
    });
  });
});
