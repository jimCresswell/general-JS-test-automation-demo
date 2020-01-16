# Pact JS Demo
General functional test automation demo for JavaScript digital services.

Includes consumer driven contract testing (CDCT) demo using [Pact JS](https://github.com/pact-foundation/pact-js).

The project has a provider service, which manages data about pollinator supporting plants in the UK, and a consumer project which does things with/to that data. Also has an external service in the Wikipedia REST API.

## Project structure
* [Provider](provider)
* Express based CRUD app in front of a data model and in-memory data store.
* [Consumer](consumer)
* Express server-side web-app, talking to the provider service to get/store data. Also gets data from the Wikipedia REST API (for the extended plant data summaries).

## Usage
For script execution `yarn` can be replaced with `npm run`.

### Running
All processes are started with [Nodemon](https://github.com/remy/nodemon) and are configured to restart the relevant server file change.
 * `yarn start` Starts the whole system.
 * `yarn start:consumer` Starts just the consumer.
 * `yarn start:provider` Starts just the provider.

### Testing
The primary purpose of automated testing is to rapidly and reproducibly measure when work is complete (when the system behaviour meets expectations). Work happens at many levels, from whole-of-product behaviour design to single component technical implementation to performance and security concerns, so automated testing happens at multiple levels of granularity, with different intent, different tools and different audiences for the feedback it provides on different timescales (milliseconds to tens of minutes). In general, the earlier in the development process a test can be run the faster its feedback can be used to correct mistakes before rework becomes necessary.

This also means that the tests often have different authors. Unit, integration and technical API tests should sit with engineers, who are also the main audience for those tests. Higher level tests such as product behaviour validation, can be a collaboration between most stakeholders, and communication of results should happen in formats and through channels appropriate to that broad audience.

As a secondary effect, the automated tests also check that the system does not unintentionally drift from expected behaviour.

Writing automated tests after development is "complete" misses most of the benefits of testing and leads to avoidable rework. Quality cannot be tested into a product, it needs to be built in from conception to realisation. For some testing, e.g. product level GUI tests, it is very hard to create the tests before implementation work begins, but it can and should be done in parallel and the work not considered complete until the automated validation is successful.

A complete automated test suite, covering the different levels and aspects of a digital product, is incredibly powerful and done well will hugely increase delivery velocity as part of a continuous integration process. However the majority of the digital products we create are ultimately for human use and so we will always need humans, sometimes engineers sometimes users, to validate the subject human experience that defines our products.

Non-functional concerns, such as product level performance and security, are specialist areas. Automation can be set up to catch some issues, but experts should be brought in to advise or audit. For product level performance, automated tests are only an approximation and focus should be given to log design and analysis to gain real world statistical insights.

#### A Note on Test Coverage
Test coverage is a very useful statistic at lower levels of testing, and less useful at higher levels of testing designed to validate the services a product provides rather than technical implementation. [See here](https://github.com/jimCresswell/e2e-web-test-framework-demo) for an example of test coverage driven by unit tests.

#### Unit Testing
Unit tests provide the fastest feedback (alongside automated syntax and style checking) when run locally on file change during development. This gives developers technical feedback while they are working on the problem and avoids the high mental cost of task switching.

They are also typically run as part of continuous integration, this can be especially important after code merges which have the potential to introduce syntax errors (and also unexpected emergent behaviour, but that is checked by higher-level test approaches).

`yarn test:unit` Provider and Consumer unit tests with [Mocha](https://mochajs.org) and [Chai](https://www.chaijs.com). Where a network interaction is tested HTTP calls and responses are mocked with [Axios Mock Adapter](https://github.com/ctimmerm/axios-mock-adapter).

The unit tests live with modules they test e.g. `my_module.js` will have a `my_module.test.js` in the same directory.

#### Consumer Driven Contract Testing (with Pact JS)
 * `yarn test:contract:consumer` Generate the consumer contracts, this is where the actual tests exist.
 * `yarn publish_pacts` Publish the consumer contracts to a remote Pact broker.
 * `yarn test:contract:provider` Get the remote contracts, verify them against the provider service, and publish the verification results back to the Pact broker. See <https://test.pact.dius.com.au/matrix/provider/Support%20Species%20App%20%28Provider%29/consumer/Species%20UI%20App%20%28Consumer%29>. These are tests in the sense that they validate provider behaviour, but only by exercising the expectations provided by the consumer through the published contract.

#### End to End API Testing of Isolated Services
These have a different intent from the contract tests. On the consumer side they test the whole consumer service rather than just the module that talks to the provider service. On the provider side they test all provider service end-points whereas the contract tests by design only test the interactions and returned payload data required by the consumer service.

##### Consumer
`yarn test:e2e:consumer` Consumer end-to-end API sanity test with [supertest](https://github.com/visionmedia/supertest). Where a network interaction is tested HTTP calls and responses are mocked with [Axios Mock Adapter](https://github.com/ctimmerm/axios-mock-adapter). Returned HTML is parsed with [Cheerio](https://github.com/cheeriojs/cheerio).  These tests are in the [consumer/e2e_test](consumer/e2e_test) directory.

##### Provider
`yarn test:e2e:provider` Provider end-to-end API sanity test with [supertest](https://github.com/visionmedia/supertest). These tests are in the [provider/e2e_test](provider/e2e_test) directory.

These are tests call the app directly (Supertest automatically binds to an ephemeral port), this leaves a slight test coverage gap in the provider service entry point file [/provider/start.js](provider/start.js), but that contains very little application logic and is covered by the whole-of-system tests.

#### Product Level Testing
See [details here]('./product_tests').

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
  * Add UI section on which species of pollinator are supported. Two columns, left plant, right pollinator, inset the image with flow around text. Reuse Wikipedia API code. DONE.
  * E2E tests for the system as a whole, using Cucumber JS and a WebDriver implementation to execute user-level specifications through user-like actions.
  * Note in README that this is a full functional testing demo for a JS app rather than just a CDCT demo.
