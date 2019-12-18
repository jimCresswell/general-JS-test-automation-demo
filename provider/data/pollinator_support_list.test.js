/*
  eslint
  prefer-arrow-callback: off,
  func-names: off,
  no-unused-expressions: off
*/

const { expect } = require('chai');

const initialData = require('./pollinator_support_species.json');
const PollinatorSupportList = require('./pollinator_support_list.js');

describe('The pollinator support list', function () {
  beforeEach(function () {
    this.list = new PollinatorSupportList(initialData);
  });

  it('can be loaded with initial data.', function () {
    const { name } = this.list.data;
    expect(name).to.equal('pollinator support species');
  });

  it('initially contains a list of pollinator supporting plants.', function () {
    const { plants } = this.list.data;
    expect(plants).to.be.an('array').with.lengthOf(4);
  });

  it('can be cleared', function () {
    this.list.clear();
    const { plants } = this.list.data;
    expect(plants).to.be.an('array').that.is.empty;
  });

  it('can be reset', function () {
    this.list.clear();
    this.list.reset();
    const { plants } = this.list.data;
    expect(plants).to.be.an('array').with.lengthOf(4);
  });
});
