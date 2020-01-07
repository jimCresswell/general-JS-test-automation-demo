/**
* E2E tests for the Pollinator Support Species UI.
*/
/* eslint prefer-arrow-callback: off, func-names: off */

const request = require('supertest');

// Chai expect for use in custom assertion functions.
const cExpect = require('chai').expect;

// HTML parser.
const cheerio = require('cheerio');

const speciesUiApp = require('../app/species_ui_app');

describe(
  'The Pollinator Support Species UI', function () {
    before(function () {
      /* Set up the base request to the API for reuse in tests. */
      this.request = request(speciesUiApp);
    });

    /* The specs for the main application entry route */
    describe('Main page', function () {
      it('responds with HTML', function (done) {
        this.request
          .get('/')
          .expect('Content-Type', /html/)
          .expect(200)
          .expect((res) => {
            const $ = cheerio.load(res.text);
            const text = $('title').text();
            cExpect(text).to.equal('Pollinator Support Species');
          })
          .end(done);
      });
    });
  }
);
