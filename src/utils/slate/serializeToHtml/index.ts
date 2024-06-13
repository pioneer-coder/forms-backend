import escapeHtml from 'escape-html';
import { Text as SlateText } from 'slate';
import SlateNode from '../SlateNode.js';

const serializeToHtml = (node: SlateNode): string => {
  if (SlateText.isText(node)) {
    let string = escapeHtml(node.text).replace(/\n/g, '<br>');
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    return string;
  }

  const childrenAsText = (node.children || []).map((n) => serializeToHtml(n)).join('');

  switch (node.type) {
    case 'paragraph':
      return `<p>${childrenAsText}</p>`;
    case 'numbered-list':
      return `<ol>${childrenAsText}</ol>`;
    case 'list-item':
      return `<li>${childrenAsText}</li>`;
    case 'list-item-child':
      return `<div>${childrenAsText}</div>`;
    default:
      return childrenAsText;
  }
};

export default serializeToHtml;
