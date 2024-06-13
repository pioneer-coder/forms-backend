import SlateNode, { Element, ExtendedText } from './SlateNode.js';

const isSlateNode = (thing: unknown): thing is SlateNode => {
  if (thing === undefined || thing === null || typeof thing !== 'object') {
    return false;
  }
  return Boolean((thing as Element)?.children) || Boolean((thing as ExtendedText)?.text);
};

export default isSlateNode;
export { SlateNode };
