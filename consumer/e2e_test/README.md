# End to End Test for the Pollinator Support Species UI

Run in isolation with mocked calls to the data API.

Uses Mocha to describe the tests, Supertest to make the requests and Cheerio to parse the returned HTML.

Note that Cheerio is a HTML parser rather than a browser and does not invoke JavaScript or make XHHR requests, so this approach isn't suitable to testing dynamic content (use e.g. JSDom for that). However this is a good approach for rapidly verifying static content and orders of magnitude faster than WebDriver for appropriate content.
