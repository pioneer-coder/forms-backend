# noodleApiKey middleware

Purpose: To authenticate server -> server requests

We have lambda functions that need to hit endpoints on noodle-api. We want to be able to authenticate these requests.

To protect an endpoint that should be hitable by a server or lambda function (or airtable) you need to
1. add a key to the ApiKey table
1. add noodleApiKey('the-slug-for-the-key-allowed')

Each thing that needs access should have it's own key to make it easier to track access and revoke persmissions if needed.
If multiple actors need access to the same endpoint, simply list all of the apiKey slugs. Eg `noodleApiKey('the-slug-for-the-key-allowed', 'some-other-access-point')`