/*
  eslint
  prefer-arrow-callback: off,
  func-names: off,
  no-unused-expressions: off,
  max-len: off
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
    this.testTitle = 'My test title';

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
    const plantData = [{
      name: 'some plant',
      wikilink: 'http://example.com/plant',
      supports: [
        {
          common_name: 'Supported species 1',
          wikilink: 'http://example.com/supported_1',
        },
        {
          common_name: 'Supported species 2',
          wikilink: 'http://example.com/supported_2',
        },
      ],
    }];

    const data = wikiApi.attachSummaries(this.axios, plantData);

    return Promise.all([
      expect(data).to.eventually.be.an('array'),
      expect(data).to.eventually.have.nested.property('[0].wikiSummary.title', this.testTitle),
      expect(data).to.eventually.have.nested.property('[0].supports[0].wikiSummary.title', this.testTitle),
      expect(data).to.eventually.have.nested.property('[0].supports[1].wikiSummary.title', this.testTitle),
    ]);
  });

  after(function () {
    // Remove the Axios mocking adapter.
    this.axiosMock.restore();
  });
});
