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
    this.private = {};
    this.private.initialData = initialData;
    this.reset();
  }

  /**
   * Clear the list of pollinator supporting plants.
   */
  clear() {
    this.private.data.plants = [];
  }

  /**
   * Set the current data to be the inital data.
   */
  reset() {
    this.private.data = cloneDeep(this.private.initialData);
  }

  /**
   * Get all the data.
   * @return {Object} A by-value copy of the full data.
   */
  getAll() {
    return cloneDeep(this.private.data);
  }

  /**
   * Add a plant.
   * @param {Object} plant A plant to add to the list.
   * @return {int} The new ID of the inserted plant object.
   */
  add(plant) {
    const newId = this.private.data.plants.length + 1;
    const plantCopy = cloneDeep(plant);

    plantCopy.id = newId;
    this.private.data.plants.push(plantCopy);

    return newId;
  }

  /**
   * Delete a plant from the list by ID.
   * @param  {int} id The ID to remove.
   * @return {Object[]}    The removed plant object(s).
   */
  deleteById(id) {
    return remove(this.private.data.plants, (plant) => plant.id === id);
  }

  /**
   * Get a plant by it's ID.
   * @param  {int} id The numeric ID to look for.
   * @return {Object}    A plant
   */
  getById(id) {
    /** @todo add type checking on the id */
    return this.private.data.plants.find((plant) => plant.id === id);
  }

  /**
   * Factory method to get a new instance with provided initial data.
   * @param  {Object} initialData The initial data object.
   * @return {PollinatorSupportList} The instiated list.
   */
  static initialise(initialData) {
    return new this(initialData);
  }
}

module.exports = PollinatorSupportList;
