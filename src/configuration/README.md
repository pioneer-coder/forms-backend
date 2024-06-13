## Adding new environment variables
1. Add to secretsmanager: noodle-documents/development
   - Make sure it's parseable by running `yarn build:check:devsecrets`
1. Add to secretsmanager: noodle-documents/qa
   - Make sure it's parseable by running `yarn build:check:devsecrets`
1. Add to secretsmanager: noodle-documents/production
   - Make sure it's parseable by running `yarn build:check:prodsecrets`
1. Add to src/configuration/envVars.ts
1. Add to .env.test - Put the value that you want assigned in tests here. This is in github so no real secrets.
1. Add to .env.example

Notes:
Please try to make sure all of the above lists are alphabetical.
Pick names to group vars together appropriately when alphatetized (eg SERVICE_KEY and SERVICE_SECRET instead of KEY_FOR_SERVICE and SECRET_FOR_SERVICE)

## When adding a new configuration
1. Add the appropriate [environment variable(s)](#adding-new environment-variables)
1. Add to Configuration typing in src/configuration/typings.ts
1. Add a `handleEnvVar` command in src/configuration/index.ts
   - Options
     - isRequired - This variable is required
        - default is false
     - defaultValue - value to assign if not specified.
        - default is null
     - isPublic - control how this configuration is displayed in the /health-checks/configuration response
        - default is false
        - true - it will be visible in the /health-checks/configuration response
        - false - only the last 3 characters will be visible /health-checks/configuration response
  - All environment variables are strings, but the configurations can be numbers, booleans etc. Use isBoolean, isNumber, etc to deserialize properly.
  - Multiple environment variables can be combined to make one configuration. See generateGraphCmsUrl for an example
