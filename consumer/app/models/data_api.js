/**
 * Get all the plants data from the provider API.
 * @param  {Object} axios A network interaction library.
 * @param  {string} providerPort The port the provider data API is operating on.
 * @return {Promise}             Promise for an array of plants.
 */
function getPlants(axios, providerPort) {
  return axios
    .get(`http://localhost:${providerPort}/plants`)
    .then((response) => response.data.plants);
}

module.exports = { getPlants };
