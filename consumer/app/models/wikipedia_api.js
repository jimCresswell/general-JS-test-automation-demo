const flattenDeep = require('lodash.flattendeep');

/**
 * Get the Wikipedia entry title from a Wikipedia URL.
 * @param  {string} wikilink Url string for a Wikipedia article.
 * @return {string}          The Wikipedia page title in URL format (with underscores).
 */
function parseTitle(wikilink) {
  const wikiUrl = new URL(wikilink);
  const path = wikiUrl.pathname;
  const pathEls = path.split('/');
  return pathEls.pop();
}

/**
 * Get a Wikipedia page summary from the Wikipedia REST API.
 * @param  {Object} axios A network interaction library.
 * @param  {string} title The Wikipedia page title in URL format (with underscores).
 * @return {Promise}      A promise for the Wikipedia page summary data. On error with err property.
 */
function getSummary(axios, title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
  return axios
    .get(url, {
      headers: {
        'User-Agent': 'Contact: https://github.com/jimCresswell/pactjs-test-demo/issues',
      },
    });
}

/**
* Get the Wikipedia page summaries for each plant and supported species
* and attach them to the data.
* @param  {Object} axios A network interaction library.
* @param  {Object} plantData The data for all the plants.
* @return {Promise}          A promise for the updated plant data.
*/
function attachSummaries(axios, plantData) {
  /**
  * @note In a real app it would be a bad idea to asynchronoulsy modify an array,
  * changes to array lenghts would cause race condition bugs.
  */

  /** @todo rewrite as a single pass over the data object */

  // Get the plant species requests.
  const plantPromises = plantData.map((plant, index) => {
    const title = parseTitle(plant.wikilink);
    return getSummary(axios, title)
      /* eslint-disable no-param-reassign */
      .then((reply) => {
        // Modify the plant data to include the summary.
        plantData[index].wikiSummary = reply.data;
      })
      .catch((err) => {
        plantData[index].wikiSummary = { errored: true, err };
      });
    /* eslint-enable no-param-reassign */
  });

  /* eslint-disable arrow-body-style */
  const supportedSpeciesPromises = plantData.map((plant, plantIndex) => {
    return plant.supports.map((species, speciesIndex) => {
      const title = parseTitle(species.wikilink);
      /* eslint-disable no-param-reassign */
      return getSummary(axios, title)
        .then((reply) => {
          // Modify the supported species data to include the summary.
          plantData[plantIndex].supports[speciesIndex].wikiSummary = reply.data;
        })
        .catch((err) => {
          plantData[plantIndex].supports[speciesIndex].wikiSummary = { errored: true, err };
        });
      /* eslint-enable no-param-reassign */
    });
  });
  /* eslint-enable arrow-body-style */

  // Flatten the supported species array of arrays of promises,
  // and join with the plant promises.
  const summaryPromises = [].concat(plantPromises, flattenDeep(supportedSpeciesPromises));

  // Once all the promises are settled return the modified plant data.
  // Errors are handled by adding an `err` property to the wikiSummary entries.
  return Promise.allSettled(summaryPromises)
    .then(() => plantData);
}

module.exports = {
  parseTitle,
  attachSummaries,
};
