# Product Level Tests
These tests are designed to examine the behaviour of the whole system from and end-user perspective.

For the sake of brevity these tests have been kept to a minimum of specifications and sophistication, here is [a more extensive demo](https://github.com/jimCresswell/e2e-web-test-framework-demo) designed to resemble a production product-level test framework.

## Technical Notes
As this is a service with a web UI these tests use a WebDriver implementation [WebDriverIO](https://webdriver.io/) to interact with the system.

The tests are expressed as product specifications, intended for a non-technical audience, written in the simple keyword language [Gherkin](https://cucumber.io/docs/gherkin/reference/) and interpreted by the framework [Cucumber.js](https://github.com/cucumber/cucumber-js), to be verified against system behaviour. Because these specifications are guaranteed to be up to date for the version of the product they are testing (if they weren't the execution would fail) they form a living documentation.

In product-level tests it is typical for external services to be mocked for increased test speed and reliability. In this case the external service is Wikipedia's REST API, to keep complexity low for this demo it has not been mocked.

The service is started and stopped through the hooks specified in the [wdio.conf.js](./wdio.conf.js) file. This approach allows the running product code to be evaluated in the same environment as the test code is run, e.g. a Jenkins slave node. In other situations it might be more useful to deploy the product code remotely and test in a more live-like configuration over a network.

## Testable GUIs
Creating the GUI and tests in parallel ensures that easily testable GUIs are built. Adding test specific `data-test` attributes to pages for element location can be extremely useful where pages lack an easily navigable DOM structure, making the tests much less likely to break if elements are moved around. The associated decrease in test maintenance costs is an excellent return on investment.

## General Notes
This is the top level of the test-automation pyramid (with the possible exception of automated visual regression testing), as such the number of tests here is kept to the absolute viable minimum, testing key user journeys only. This minimises slow execution, high maintenance costs and false negative tests results (flakiness). Where more detailed validation is needed that can happen at lower levels, either the end-to-end tests of individual services, or integration and unit tests within those services.

Tests at the whole-of-system level cast the widest net for finding issues, and best reflect how those issues might affect users, they are also the least able to specify the cause of the issues. Where faults are found through product tests a lower-level test should be created to make sure the issue is fixed and does not recur. Creating additional product level regression tests is also an option but they should be executed on the basis of risk, and retired once the risk is mitigated.

These tests are designed to validate the behaviour of the product, not to test the UI elements themselves, that can happen much faster at lower levels of testing with injected application state.
