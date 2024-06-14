const getProjectName = (): string => process.env.npm_package_name || 'questionnaires-backend';

export default getProjectName;
