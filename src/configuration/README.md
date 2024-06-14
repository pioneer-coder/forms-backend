## Adding new environment variables

1. Add to secretsmanager: noodle-documents/development
   - Make sure it's parseable by running `yarn build:check:devsecrets`
1. Add to secretsmanager: noodle-documents/qa
   - Make sure it's parseable by running `yarn build:check:devsecrets`
1. Add to secretsmanager: noodle-documents/production
   - Make sure it's parseable by running `yarn build:check:prodsecrets`
1. Add to src/configuration/environmentSchema.ts
1. Add to .env.test - Put the value that you want assigned in tests here. This is in github so no real secrets.

Notes:
Please try to make sure all of the above lists are alphabetical.
Pick names to group vars together appropriately when alphatetized (eg SERVICE_KEY and SERVICE_SECRET instead of KEY_FOR_SERVICE and SECRET_FOR_SERVICE)
