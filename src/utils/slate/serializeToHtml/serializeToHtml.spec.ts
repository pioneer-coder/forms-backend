import { expect } from 'chai';
import serializeToHtml from './index.js';

describe('utils/slate/serializeToHtml', function () {
  it('should just return text', function () {
    expect(serializeToHtml({ text: 'bare text' })).to.equal(
      'bare text',
    );
  });

  it('should convert a paragraph', function () {
    expect(serializeToHtml({
      children: [{
        children: [{ text: 'some message' }],
        type: 'paragraph',
      }],
    })).to.equal(
      '<p>some message</p>',
    );
  });

  it('should replace new lines with <br> tags', function () {
    expect(serializeToHtml({
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
    })).to.equal('<p>Attach audio<br></p>');
  });

  it('should replace multiple new lines with <br> tags', function () {
    expect(serializeToHtml({
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
    })).to.equal('<p>bvbvvcbvcbvcbvcb<br><br><br>fdsfdsfdsfdsf<br><br>gdf</p>');
  });

  it('should insert div inside of li tags', function () {
    expect(serializeToHtml({
      children: [
        {
          children: [
            {
              children: [
                {
                  children: [
                    {
                      text: 'item 1.',
                    },
                  ],
                  type: 'list-item-child',
                },
              ],
              type: 'list-item',
            },
            {
              children: [
                {
                  children: [
                    {
                      text: 'item 2.',
                    },
                  ],
                  type: 'list-item-child',
                },
              ],
              type: 'list-item',
            },
          ],
          type: 'numbered-list',
        },
      ],
    })).to.equal('<ol><li><div>item 1.</div></li><li><div>item 2.</div></li></ol>');
  });
});
