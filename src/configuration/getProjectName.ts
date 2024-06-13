import { Deserializer } from './typings.js';

const getProjectName = (): string => process.env.npm_package_name || 'webforms/backend';
const deserializer: Deserializer<string> = () => {
  throw new Error('No real deserializer for this');
};

getProjectName.deserializer = deserializer;

export default getProjectName;
