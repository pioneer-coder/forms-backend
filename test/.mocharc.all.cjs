module.exports = {
  exit: true,
  extension: ['ts'],
  file: [
    'test/setup.ts',
  ],
  require: [
    'tsconfig-paths/register',
  ],
  spec: [
    'src/**/*.spec.js',
    'src/**/*.spec.ts',
  ],
  timeout: 100 * 1000,
  'watch-files': [
    './src/**/*.ts',
    'test/**/*.ts',
  ],
  "node-option": [
    "import=tsx",
    "no-warnings"
  ],
};
