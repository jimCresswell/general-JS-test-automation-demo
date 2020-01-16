/**
 * Bind the step functions to the Cucumber steps.
 */
/*
   eslint
   prefer-arrow-callback: off,
   func-names: off,
*/

const { expect } = require('chai');
const { Given, When, Then } = require('cucumber');

const mainPage = require('./main.page');

// List of expected pollinators per plant.
const expectedPollinatorNames = {
  'Marsh Marigold': ['Marsh-Marigold Moth', 'Hoverflies'],
};

Given(/^I want to know about plants that support pollinator insect species$/, function () {
  mainPage.open();
});

When(/^I look up "(.*)"$/, function (plantName) {
  this.plantName = plantName;
});

Then(/^I can see a list of supported pollinators$/, function () {
  const actualPollinatorNames = mainPage.getPollinatorNames(this.plantName);
  expect(actualPollinatorNames).to.include.members(expectedPollinatorNames[this.plantName]);
});
