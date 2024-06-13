import { Text as SlateText } from 'slate';
import SlateNode from '../SlateNode.js';

const serializeToPlainText = (node: SlateNode): string => {
  if (SlateText.isText(node)) {
    return node.text;
  }
  return (node.children || []).map((n) => serializeToPlainText(n)).join('\n');
};

export default serializeToPlainText;
