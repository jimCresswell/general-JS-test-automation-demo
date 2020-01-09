/*
  eslint
  prefer-arrow-callback: off,
  func-names: off,
  no-unused-expressions: off
*/

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const { expect } = chai;

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

  it('can attach summaries (attachSummaries)', function () {
    const plantData = [{ name: 'some plant', wikilink: 'http://example.com' }];
    const data = wikiApi.attachSummaries(this.axios, plantData);
    return expect(data)
      .to.eventually.be.an('array')
      .which.has.nested.property('[0].wikiSummary.title', this.testTitle);
  });

  after(function () {
    // Remove the Axios mocking adapter.
    this.axiosMock.restore();
  });
});
