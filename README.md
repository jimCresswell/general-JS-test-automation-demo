# Pact JS Demo
Consumer driven contract testing (CDCT) demo using [Pact JS](https://github.com/pact-foundation/pact-js).

The project has a provider service, which manages data about pollinator supporting plants in the UK, and a consumer project which does things with/to that data.

## Usage
For script execution `yarn` can be replaced with `npm run`.

### Testing

#### Unit Testing
`yarn test:unit` Provider and Consumer unit tests with [Mocha](https://mochajs.org) and [Chai](https://www.chaijs.com). Where a network interaction is tested HTTP calls and responses are mocked with [Axios Mock Adapter](https://github.com/ctimmerm/axios-mock-adapter).

The unit tests live with modules they test e.g. `my_module.js` will have a `my_module.test.js` in the same directory.

#### End to End API Testing of Isolated Services

##### Consumer
`yarn test:consumer:e2e` Consumer end-to-end API sanity test with [supertest](https://github.com/visionmedia/supertest). Where a network interaction is tested HTTP calls and responses are mocked with [Axios Mock Adapter](https://github.com/ctimmerm/axios-mock-adapter). Returned HTML is parsed with [Cheerio](https://github.com/cheeriojs/cheerio).

##### Provider
`yarn test:provider:e2e` Provider end-to-end API sanity test with [supertest](https://github.com/visionmedia/supertest). These tests are in the [provider/e2e_test](provider/e2e_test) directory.

These are tests as call the app directly (Supertest automatically binds to an ephemeral port), this leaves a slight test coverage gap in the provider service entry point file [/provider/start.js](provider/start.js), but that contains very little application logic and is covered by the whole-of-system end to end tests.

#### Whole of System Testing
Not yet implemented. Will use Cucumber and WebDriver to execute human readable specifications against the system.

## Project structure
 * [Provider](provider)
   * Express CRUD app in front of a data model and "database"
 * [Consumer](consumer)
   * Express web-app with mostly (entirely?) server-side service logic, talking to the provider service to get/store data. Also gets data from the Wikipedia REST API (for the extended plant data summaries).

## Notes on development/test approach
  * Provider and Consumer.
    * BDD unit tests that work as living engineering documentation, to complement the JSDocs. (Investigate linking to the two, as well as markdown files).
    * Consumer driven contract testing, with pacts created by unit testing the consumer's network interaction code, then verified by the provider, with that verification status published.
  * Provider
    * API driven development for the network interactions using Supertest. This precedes consumer driven contract testing (CDCT), most APIs undergo some development before they have consumers. This may be entirely replaced by CDCT, or continue to function as an e2e sanity test.
  * Consumer
    * E2E test through UI with fake network interactions, see [consumer/e2e_test/README.md][consumer/e2e_test/README.md].
    * BDD unit tests of any client-side JavaScript.
  * Whole System
    * Cucumber + WebDriver tests for key user journeys only.

## To Do
  * Create the most basic implementation of the provider service possible. DONE.
  * Create the skeleton for the consumer service. DONE.
    * Server-side data interactions with the provider. DONE.
    * Server-side rendering of UI. Unit tests. Integration tests as required. DONE.
  * Create consumer driven contract tests between consumer and provider.
    * Consumer tests
    * Publish the pacts.
    * Run them against the provider.
  * Add UI section on which species of pollinator are supported. Two columns, left plant, right pollinator, inset the image with flow around text. Reuse Wikipedia API code.
  * E2E tests for the system as a whole, using CucumberJS and a WebDriver implementation to execute user-level specifications through user-like actions.
  * Add some client-side JavaScript and provide in-browser tests.
  * Note in README that this is a full functional testing demo for a JS app rather than just a CDCT demo.
