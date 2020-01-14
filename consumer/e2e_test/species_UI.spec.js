/**
* E2E tests for the Pollinator Support Species UI.
*/
/* eslint prefer-arrow-callback: off, func-names: off */

// Make and test calls to the web UI server.
const request = require('supertest');

// Chai expect for use in custom assertion functions.
const cExpect = require('chai').expect;

// HTML parser.
const cheerio = require('cheerio');

// Mock reponses from back-end services.
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const getApp = require('../app/species_ui_app');

describe('The Pollinator Support Species UI', function () {
  before(function () {
    // The fake port to make the mock data API calls to.
    this.mockProviderPort = 999;

    // Iniate the mocking of the back-end (provider) service calls.
    this.axiosMock = new MockAdapter(axios);

    // Configure the web UI service (consumer) to use the Axios instance
    // modified with the mock adapter.
    // Note that the mocked calls and responses are to the back-end API (the provider).
    const disableLogging = true;
    const speciesUiApp = getApp(axios, this.mockProviderPort, disableLogging);

    /* Set up the base request to the web API for reuse in tests. */
    this.request = request(speciesUiApp);
  });

  // After each test reset the mock handlers.
  this.afterEach(function () {
    this.axiosMock.resetHandlers();
  });

  // After all the tests are complete remove the Axios mocking adapter.
  after(function () {
    this.axiosMock.restore();
  });

  /* The specs for the main application entry route */
  describe('The Support Species App (consumer)', function () {
    describe('Handles success', function () {
      before(function () {
        // Test data. Should be passed through the app and rendered.
        this.commonName = 'A lovely plant.';

        // Mock specific paths on the provider data API, pass through the rest.
        this.axiosMock
          .onGet(`http://localhost:${this.mockProviderPort}/plants`)
          .reply(200, {
            plants: [{
              common_name: this.commonName,
              wikilink: 'http://en.wikipedia.org/wiki/not_a_page',
              supports: [
                {
                  wikilink: 'http://en.wikipedia.org/wiki/also_not_a_page',
                },
              ],
            }],
          })
          // Don't bother Wikipedia during testing.
          .onGet(/https:\/\/en.wikipedia.org\/api\/rest_v1\/.*/)
          .reply(200, {
            extract_html: '<p id="testSummary">A wiki page summary.</p>',
          })
          // Need this so the Supertest calls to the web UI server don't get
          // captured, the mock-adapter might be modifying the Node http object
          // under the hood or something like that.
          .onAny()
          .passThrough();
      });

      it('main route responds with HTML.', function (done) {
        this.request
          .get('/')
          .expect('Content-Type', /html/)
          .expect(200)
          .expect((res) => {
            const $ = cheerio.load(res.text);
            const text = $('title').text();
            cExpect(text).to.equal('Pollinator Supporting Plants');
            cExpect($('h2').text()).to.include(this.commonName);
            cExpect($('#testSummary').text()).to.include('A wiki page summary');
          })
          .end(done);
      });
    });

    describe('Handles network errors', function () {
      before(function () {
        // Mock specific paths on the provider data API, pass through the rest.
        this.axiosMock
          .onGet(`http://localhost:${this.mockProviderPort}/plants`)
          .networkError();
        this.axiosMock
          // Don't bother Wikipedia during testing.
          .onGet(/https:\/\/en.wikipedia.org\/api\/rest_v1\/.*/)
          .reply(200, {
            extract_html: '<p id="testSummary">A wiki page summary.</p>',
          })
          .onAny()
          .passThrough();
      });

      // Note that the error message will also appear in the console
      // because the Express error handler does that.
      it('renders errors to the UI', function (done) {
        this.request
          .get('/')
          .expect('Content-Type', /html/)
          .expect(500)
          .expect((res) => {
            const $ = cheerio.load(res.text);
            cExpect($('title').text()).to.equal('Error');
          })
          .end(done);
      });
    });
  });
});
