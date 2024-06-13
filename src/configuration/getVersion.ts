import { Deserializer } from './typings.js';

const getVersion = (): string => process.env.npm_package_version || '0.0.0';

const deserializer: Deserializer<string> = () => {
  throw new Error('No real deserializer for this');
};

getVersion.deserializer = deserializer;

export default getVersion;
