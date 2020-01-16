# Product Level Tests

These tests are designed to examine the behaviour of the whole system from and end-user perspective.

As this is a service with a web UI these tests will use [WebDriver](https://webdriver.io/) to interact with the system.

The tests will be expressed as product specifications, written in the simple keyword language Gherkin and interpreted by the framework Cucumber JS, to be verified against system behaviour. Because these specifications are guaranteed to be up to date for the version of the product they are testing (if they weren't the execution would fail) they form a living documentation.

In product-level tests it is typical for external services to be mocked for increased test speed and reliability. In this case the external service is Wikipedia's REST API, to keep complexity low for this demo it has not been mocked.

This is the top level of the test-automation pyramid (with the possible exception of automated visual regression testing), as such the number of tests here is kept to the absolute viable minimum, testing key user journeys only. This minimises slow execution, high maintenance costs and false negative tests results (flakiness). Where more detailed validation is needed that can happen at lower levels, either the end-to-end tests of individual services, or integration and unit tests within those services.

Tests at the whole-of-system level cast the widest net for finding issues, and best reflect how those issues might affect users, they are also the least able to specify the cause of the issues. Where faults are found through product tests a lower-level test should be created to make sure the issue is fixed and does not recur. Creating additional product level regression tests is also an option but they should be executed on the basis of risk, and retired once the risk is mitigated.

These tests are designed to validate the behaviour of the product, not to test the UI elements themselves, that can happen much faster at lower levels of testing with injected application state.

For the sake of brevity these tests have been kept to a minimum of specifications and code complexity, here is [a more extensive demo](https://github.com/jimCresswell/e2e-web-test-framework-demo) designed to resemble a production product-level test framework.
