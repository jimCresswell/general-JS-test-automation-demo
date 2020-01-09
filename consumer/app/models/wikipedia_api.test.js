/*
  eslint
  prefer-arrow-callback: off,
  func-names: off,
  no-unused-expressions: off
*/

const { expect } = require('chai');

const wikiApi = require('./wikipedia_api');

describe('The Wikipedia model non-network functions', function () {
  it('can get article titles from article links (parseTitle)', function () {
    const link = 'https://en.wikipedia.org/wiki/Rhamnus_cathartica';
    const title = wikiApi.parseTitle(link);

    expect(title).to.equal('Rhamnus_cathartica');
  });
});
