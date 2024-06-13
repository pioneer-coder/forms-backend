import { customAlphabet } from 'nanoid';

const generateRandomPart = customAlphabet('123456789abcdefghijklmnopqrstuvwxyz', 32);
const generateKey = ({ prefix }: { prefix: string }): string => `${prefix}_${generateRandomPart()}`;

export default generateKey;
