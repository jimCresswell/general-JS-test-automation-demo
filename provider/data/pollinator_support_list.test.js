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
    this.list = PollinatorSupportList.initialise(initialData);
  });

  it('can be loaded with initial data.', function () {
    const { name } = this.list.getAll();
    expect(name).to.equal('pollinator support species');
  });

  it('initially contains a list of pollinator supporting plants.', function () {
    const { plants } = this.list.getAll();
    expect(plants).to.be.an('array').with.lengthOf(4);
  });

  it('can be cleared.', function () {
    this.list.clear();
    const { plants } = this.list.getAll();
    expect(plants).to.be.an('array').that.is.empty;
  });

  it('can be reset.', function () {
    this.list.clear();
    this.list.reset();
    const { plants } = this.list.getAll();
    expect(plants).to.be.an('array').with.lengthOf(4);
  });

  it('can get plants by ID.', function () {
    const plant1 = this.list.getById(1);
    expect(plant1).to.have.property('species', 'Rhamnus cathartica');
  });

  it('cannot get plants by IDs that do not exist.', function () {
    const plant1 = this.list.getById(9999);
    expect(plant1).to.be.undefined;
  });

  it('can delete plants by ID.', function () {
    let { plants } = this.list.getAll();
    const idToRemove = plants.length; // Set the last plant in the list to be removed.

    // Get the current and expected name list.
    const originalNames = plants.map((plant) => plant.common_name);
    const expectedNames = originalNames.slice(0, plants.length - 1); // Remove the last name.

    const removedPlant = this.list.deleteById(idToRemove)[0];

    // The removed element is returned.
    expect(removedPlant).to.have.property('common_name', 'Marsh Thistle');

    // The plants list is passed by value rather than reference
    // so a new copy is needed to see changes.
    plants = this.list.getAll().plants;
    const remainingNames = plants.map((plant) => plant.common_name);
    expect(remainingNames).to.have.members(expectedNames);
  });

  it('can have extra plants added.', function () {
    const newPlantData = {
      common_name: 'Snozcumber',
      species: 'Cucumis dahlius',
      link: 'https://en.wikipedia.org/wiki/The_BFG',
    };

    // Check the new plant is properly assigned an ID.
    const id = this.list.add(newPlantData);
    expect(id).to.equal(5);

    // Use the ID to check the plant made it into the data store.
    const newPlant = this.list.getById(id);
    expect(newPlant).to.have.property('common_name', 'Snozcumber');
  });
});
