# Pact JS Demo
Consumer driven contract testing (CDCT) demo using [Pact JS](https://github.com/pact-foundation/pact-js).

The project has a provider service, which manages data about pollinator supporting plants in the UK, and a consumer project which does things with/to that data.

## Usage
For script execution `yarn` can be replaced with `npm run`.

### Testing

#### Unit Testing
`yarn test:unit` Provider and Consumer unit tests with [Mocha](https://mochajs.org) and [Chai](https://www.chaijs.com). Where a network interaction is tested HTTP calls and responses are mocked with [Axios Mock Adapter](https://github.com/ctimmerm/axios-mock-adapter).

The unit tests live with modules they test e.g. `my_module.js` will have a `my_module.test.js` in the same directory.

#### Consumer Driven Contract Testing (with Pact JS)
 * `yarn test:contract:consumer` Generate the consumer contracts.
 * `yarn publish_pacts` Publish the consumer contracts to a remote Pact broker.
 * `yarn test:contract:provider` Get the remote contracts, verify them against the provider service, and publish the verification results back to the Pact broker. See <https://test.pact.dius.com.au/matrix/provider/Support%20Species%20App%20%28Provider%29/consumer/Species%20UI%20App%20%28Consumer%29>.

#### End to End API Testing of Isolated Services
These have a different intent from the contract tests. On the consumer side they test the whole consumer service rather than just the module that talks to the provider service. On the provider side they test all provider service end-points whereas the contract tests by design only test the interactions and returned payload data required by the consumer service.

##### Consumer
`yarn test:e2e:consumer` Consumer end-to-end API sanity test with [supertest](https://github.com/visionmedia/supertest). Where a network interaction is tested HTTP calls and responses are mocked with [Axios Mock Adapter](https://github.com/ctimmerm/axios-mock-adapter). Returned HTML is parsed with [Cheerio](https://github.com/cheeriojs/cheerio).  These tests are in the [consumer/e2e_test](consumer/e2e_test) directory.

##### Provider
`yarn test:e2e:provider` Provider end-to-end API sanity test with [supertest](https://github.com/visionmedia/supertest). These tests are in the [provider/e2e_test](provider/e2e_test) directory.

These are tests call the app directly (Supertest automatically binds to an ephemeral port), this leaves a slight test coverage gap in the provider service entry point file [/provider/start.js](provider/start.js), but that contains very little application logic and is covered by the whole-of-system tests.

#### Whole of System Testing
Not yet implemented. Will use Cucumber and WebDriver to execute human readable specifications against the system.

## Project structure
 * [Provider](provider)
   * Express based CRUD app in front of a data model and in-memory data store.
 * [Consumer](consumer)
   * Express server-side web-app, talking to the provider service to get/store data. Also gets data from the Wikipedia REST API (for the extended plant data summaries).

## To Do
  * Create the most basic implementation of the provider service possible. DONE.
  * Create the skeleton for the consumer service. DONE.
    * Server-side data interactions with the provider. DONE.
    * Server-side rendering of UI. Unit tests. Integration tests as required. DONE.
  * Create consumer driven contract tests between consumer and provider. DONE.
    * Consumer tests DONE.
    * Publish the pacts. DONE.
    * Run them against the provider. DONE.
    * Publish the verification results. DONE.
  * Add UI section on which species of pollinator are supported. Two columns, left plant, right pollinator, inset the image with flow around text. Reuse Wikipedia API code.
  * E2E tests for the system as a whole, using Cucumber JS and a WebDriver implementation to execute user-level specifications through user-like actions.
  * Add some client-side JavaScript and provide in-browser tests (?).
  * Note in README that this is a full functional testing demo for a JS app rather than just a CDCT demo.
