/*
  eslint
  prefer-arrow-callback: off,
  func-names: off,
  no-unused-expressions: off
*/

const { expect } = require('chai');

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const wikiApi = require('./wikipedia_api');

describe('The Wikipedia model non-network functions', function () {
  it('can get article titles from article links (parseTitle)', function () {
    const link = 'https://en.wikipedia.org/wiki/Rhamnus_cathartica';
    const title = wikiApi.parseTitle(link);

    expect(title).to.equal('Rhamnus_cathartica');
  });
});

describe('The Wikipedia model network functions', function () {
  before(function () {
    this.testTitle = 'My test title.';

    // Iniate the mocking of the back-end (provider) service calls.
    this.axios = axios;
    this.axiosMock = new MockAdapter(this.axios);

    // Mock specific paths on the provider data API, pass through the rest.
    this.axiosMock
      .onGet()
      .reply(200, {
        title: this.testTitle,
      });
  });

  it('can attach summaries (attachSummaries)', function (done) {
    const plantData = [{ wikilink: 'http://example.com' }];
    wikiApi.attachSummaries(this.axios, plantData)
      .then((data) => {

        /** @todo WHY IS THIS CALLED TWICE? PROMISE CONSTRUCTION ERROR? */
        console.log('****', data, '&&&&', data[0].wikiSummary);

        expect(data).to.be.an('array');
        expect(data[0].wikiSummary.data).to.deep.include({ title: this.testTitle });
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  after(function () {
    // Remove the Axios mocking adapter.
    this.axiosMock.restore();
  });
});
