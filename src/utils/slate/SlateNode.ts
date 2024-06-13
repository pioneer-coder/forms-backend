import { Text as SlateText } from 'slate';

export type ExtendedText = SlateText & {
  bold?: boolean;
  italic?: boolean;
}

export type Element = {
  type?: 'paragraph' | 'numbered-list' | 'list-item' | 'list-item-child',
  children: Array<SlateNode | ExtendedText> // eslint-disable-line no-use-before-define
}

type SlateNode = ExtendedText | Element;

export default SlateNode;
