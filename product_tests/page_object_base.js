/**
 * Check the URL argument is valid.
 * @param  {string} url The URL string to validate.
 */
function validateUrl(url) {
  if (url === undefined) {
    throw new TypeError(
      'PageObject constructor called without passing a URL'
    );
  }
}

/**
 * The base pageObject class.
 */
class PageObject {
  /**
   * Constructor.
   * @param {String} url The URL for this page relative to the default base URL.
   * @param {Array=} sections An optional array of page sections to mix in.
   */
  constructor(url) {
    validateUrl(url);
    this.url = url;
  }

  /**
   * Open the page directly.
   */
  open() {
    browser.url(this.url);
  }
}
module.exports = PageObject;
