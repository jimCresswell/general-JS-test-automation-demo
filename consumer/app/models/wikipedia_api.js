
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
    })
    .catch((err) => ({ err }));
}

/**
* Get the Wikipedia page summaries for each plant and attach them to the data.
* @param  {Object} axios A network interaction library.
* @param  {Object} plantData The data for all the plants.
* @return {Promise}          A promise for the updated plant data.
*/
function attachSummaries(axios, plantData) {
  const summaryPromises = plantData.map((plant, index) => {
    const title = parseTitle(plant.wikilink);
    return getSummary(title)
      .then((summaryData) => {
        // Modify the plant data to include the summary.
        /** @todo If this was a real app modify a copy of the data to avoid side-effects. */
        /* eslint-disable no-param-reassign */
        plantData[index].wikiSummary = summaryData;
        /* eslint-enable no-param-reassign */
      });
  });

  // Once all the promises are settled return the modified plant data.
  // Errors are handled by adding an `err` property to the plant data entry (in `getSummary`).
  return Promise.allSettled(summaryPromises)
    .then(() => plantData);
}

module.exports = {
  attachSummaries,
  parseTitle,
};
