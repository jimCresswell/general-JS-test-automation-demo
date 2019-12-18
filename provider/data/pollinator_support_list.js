const cloneDeep = require('lodash.clonedeep');
const remove = require('lodash.remove');

/**
 * A list of pollinator support species and associated methods.
 */
class PollinatorSupportList {
  /**
   * Get the initial data and set it to be the current data.
   * @param {Object} initialData The initial data.
   */
  constructor(initialData) {
    this.initialData = initialData;
    this.reset();
  }

  /**
   * Clear the list of pollinator supporting plants.
   */
  clear() {
    this.data.plants = [];
  }

  /**
   * Set the current data to be the inital data.
   */
  reset() {
    this.data = cloneDeep(this.initialData);
  }

  /**
   * Add a plant.
   * @param {Object} plant A plant to add to the list.
   * @return {int} The new ID of the inserted plant object.
   */
  add(plant) {
    const newId = this.data.plants.length + 1;
    const plantCopy = cloneDeep(plant);

    plantCopy.id = newId;
    this.data.plants.push(plantCopy);

    return newId;
  }

  /**
   * Delete a plant from the list by ID.
   * @param  {int} id The ID to remove.
   * @return {Object[]}    The removed plant object(s).
   */
  deleteById(id) {
    return remove(this.data.plants, (plant) => plant.id === id);
  }

  /**
   * Get a plant by it's ID.
   * @param  {int} id The numeric ID to look for.
   * @return {Object}    A plant
   */
  getById(id) {
    /** @todo add type checking on the id */
    return this.data.plants.find((plant) => plant.id === id);
  }
}

module.exports = PollinatorSupportList;
