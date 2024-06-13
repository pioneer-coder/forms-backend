const getEnvVar = (key?: string): string => {
  if (!key) {
    return '';
  }
  return process.env[key] || '';
};

export default getEnvVar;
