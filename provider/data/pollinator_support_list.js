const cloneDeep = require('lodash.clonedeep');

/**
 * A list of pollinator support species and associated methods.
 */
class PollinatorSupportList {
  /**
   * Get the initial data and set it to be the current data.
   */
  constructor() {
    this.initialData = require('./pollinator_support_species.json');
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
}

module.exports = PollinatorSupportList;
