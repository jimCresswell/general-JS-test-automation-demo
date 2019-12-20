const cloneDeep = require('lodash.clonedeep');
const remove = require('lodash.remove');

/**
 * Make sure IDs are valid integers or throw.
 * @param  {Object} id The ID to check.
 * @return {int}    The validated ID.
 */
function validateId(id) {
  const intId = Number.parseInt(id, 10);

  if (Number.isFinite(intId)) {
    return intId;
  }

  throw new TypeError(`ID could not be converted to a finite integer. Received: ${id}`);
}

/**
 * Generate a function to match a plant based on a supplied ID.
 * @param  {int} id The ID to match on.
 * @return {Function}    The predicate function.
 */
function getIdPredicate(id) {
  return (plant) => plant.id === id;
}

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
   * @param  {Object} id The ID to remove.
   * @return {Object}    The removed plant object.
   */
  deleteById(id) {
    const intId = validateId(id);
    // Note: the remove function returns an array of removed elements,
    // we always expect there to be 0 or 1 removed element.
    return remove(this.private.data.plants, getIdPredicate(intId))[0];
  }

  /**
   * Get a plant by it's ID.
   * @param  {Object} id The numeric ID to look for.
   * @return {Object}    A plant
   */
  getById(id) {
    const intId = validateId(id);
    return this.private.data.plants.find(getIdPredicate(intId));
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
