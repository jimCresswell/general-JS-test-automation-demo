# Pact JS Demo
Consumer driven contract testing (CDCT) demo using [Pact JS](https://github.com/pact-foundation/pact-js).

The project has a provider service, which manages data about pollinator supporting plants in the UK, and a consumer project which does things with/to that data.

## Usage
For script execution `yarn` can be replaced with `npm run`.

 * `yarn test:unit` Provider and Consumer unit tests with [Mocha](https://mochajs.org) and [Chai](https://www.chaijs.com). The unit tests live with modules they test e.g. `my_module.js` will have a `my_module.test.js` in the same directory.
 * `yarn test:provider:e2e` Provider end-to-end API sanity test with [supertest](https://github.com/visionmedia/supertest). These tests are in the [provider/e2e_test](provider/e2e_test) directory. Strictly speaking these are integration tests as they call the app directly rather than operating over HTTP, but the trade-off is much faster test execution versus a slight coverage gap in the provider [service entry point file](provider/support_species_service.js).

## Project structure
 * provider
   * Express CRUD app in front of a data model and "database"
 * consumer
   * Express web-app with mostly (entirely?) server-side service logic, talking to the provider service to get/store data.

## Notes on development/test approach
  * Provider/Consumer.
    * BDD unit tests that work as living engineering documentation, to complement the JSDocs. (Investigate linking to the two, as well as markdown files).
    * Consumer driven contract testing, with pacts created by unit testing the consumer's network interaction code, then verified by the provider, with that verification status published.
  * Provider
    * API driven development for the network interactions using Supertest. This precedes consumer driven contract testing (CDCT), most APIs undergo some development before they have consumers. This may be entirely replaced by CDCT, or continue to function as an e2e sanity test.
  * consumer
    * Integration tests as necessary, not through UI.
    * BDD unit tests of any client-side JavaScript.
    * E2E test through UI with fake network interactions.

## To Do
  * Update readme to become guide to approaches.
  * Create the most basic implementation of the provider service possible.
  * Create the skeleton for the consumer service.
    * Get data
    * Add data (?)
    * Display data in webpage
  * Create consumer driven contract tests on the consumer side with Pact JS.
  * Publish the pacts.
  * Run them against the provider.
  * Iterate consumer and provider.
