const parseItem = (str: string): string | RegExp => {
  const reMatch = str.match(/^\/(.*)\/$/);
  if (!reMatch) {
    return str;
  }
  return new RegExp(reMatch[1]);
};

const parseOriginList = (strs: string[]): (string | RegExp)[] => strs.map(parseItem);

export default parseOriginList;
