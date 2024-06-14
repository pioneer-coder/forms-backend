import environmentSchema from './environmentSchema.js';

const ENV_VARS = Object.keys(environmentSchema);

export default [
  ...ENV_VARS,
  'SHELL_PROMPT',
];
