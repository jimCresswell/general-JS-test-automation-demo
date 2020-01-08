/**
* E2E tests for the Pollinator Support Species UI.
*/
/* eslint prefer-arrow-callback: off, func-names: off */

// Make and test calls to the web server.
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
    // Iniate the mocking of the back-end (provider) service calls.
    this.axiosMock = new MockAdapter(axios);

    // Configure the web UI service (consumer) to use the Axios instance
    // modified with the mock adapter.
    // Note that the mocked calls and responses are to the back-end API (the provider).
    const speciesUiApp = getApp(axios);

    /* Set up the base request to the web API for reuse in tests. */
    this.request = request(speciesUiApp);
  });

  after(function () {
    // Remove the Axios mocking adapter.
    this.axiosMock.restore();
  });

  /* The specs for the main application entry route */
  describe('Main page', function () {
    before(function () {
      // Test data. Should be passed through the app and rendered.
      this.commonName = 'A lovely plant.';

      // Mock specific paths on the provider data API, pass through the rest.
      this.axiosMock
        .onGet('http://localhost:3001/plants')
        .reply(200, {
          plants: [{ common_name: this.commonName }],
        })
        .onAny().passThrough();
    });

    it('responds with HTML', function (done) {
      this.request
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          const text = $('title').text();
          cExpect(text).to.equal('Pollinator Support Species');
          cExpect($('li').text()).to.equal(this.commonName);
        })
        .end(done);
    });
  });
});
