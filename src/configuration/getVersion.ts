const getVersion = (): string => process.env.npm_package_version || '0.0.0';

export default getVersion;
