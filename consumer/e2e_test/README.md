# End to End Test for the Pollinator Support Species UI

Run in isolation with mocked calls to the data API and external service ([Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/#/Page%20content)).

Uses Mocha to describe the tests, [Supertest](https://github.com/visionmedia/supertest) to make the requests to the web server and [Cheerio](https://github.com/cheeriojs/cheerio) to parse the returned HTML. Uses [Axios Mock Adapter](https://github.com/ctimmerm/axios-mock-adapter) to mock the responses from the [Axios](https://github.com/axios/axios) framework network calls to the back-end.

Note that Cheerio is a HTML parser rather than a browser and does not invoke JavaScript or make XHHR requests, so this approach isn't suitable to testing dynamic content. However this is a good approach for rapidly verifying static content and orders of magnitude faster than WebDriver for appropriate content.

If more detailed or interactive UI testing is required alternatives are possible such as an in-code headless browser e.g. [JSDOM](https://github.com/jsdom/jsdom), or if necessary locally run web-based tests using mocks and e.g. [WebDriverIO](https://webdriver.io/), [Cypress](https://www.cypress.io/) or [Pupeteer](https://pptr.dev/).

It is also possible to test UI components in isolation. This approach can be useful for complex client-side rendering created with e.g. [React](https://jestjs.io/docs/en/tutorial-react#dom-testing).
