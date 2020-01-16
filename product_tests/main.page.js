/**
 * The page object handles interactions with the web UI.
 */

const PageObject = require('./page_object_base');

// Use the full baseUrl as defined in `wdio.conf.js`.
const URL = '';

// Turn a name into a DOM ID by replacing spaces with underscores.
const toId = (stringWithSpaces) => stringWithSpaces.replace(' ', '_');

/**
 * A list of getters for UI elements on the page.
 * Getters are a useful pattern here as they force WDIO to make a new
 * JSON wire protocol request for the element on each use, avoiding
 * stale element references, a common cause of WebDriver test flakiness.
 * @type {Object}
 */
/* eslint-disable max-len */
const els = {
  // Given a plant name find the associated list of supported pollinators.
  getPollinatorList: (plantName) => {
    const plantId = toId(plantName);
    const selector = `#${plantId} ~ [data-test="details"] [data-test="supported-species"]`;
    return $(selector);
  },
};
/* eslint-enable max-len */

/**
 * Singleton page object for the default URL page.
 */
class MainPage extends PageObject {
  /**
   * The "main page" page object.
   */
  constructor() {
    super(URL);
  }

  /**
   * Get a list of the pollinator names for the supplied plant.
   * @param  {string} plantName The name of the plant to be pollinated.
   * @return {string[]} A list of names.
   */
  getPollinatorNames(plantName) {
    // Get the pollinator list and the pollinator name headings inside.
    const pollinatorList = els.getPollinatorList(plantName);

    // Note: it would be better to use a 'data-test' selector here so that the page markup
    // can be changed without the test breaking. Left like this as an example.
    const pollinatorHeadings = pollinatorList.$$('h4');

    // Map the headings to the text they contain.
    return pollinatorHeadings.map((el) => el.getText());
  }
}

const mainPage = new MainPage();

module.exports = mainPage;
