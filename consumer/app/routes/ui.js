const express = require('express');

/* eslint-disable new-cap */
const router = express.Router();
/* eslint-enable new-cap */

const dataApi = require('../models/data_api');
const wikiApi = require('../models/wikipedia_api');

/**
 * Get the router for these routes, allows dependency injection.
 * @param  {Object} axios A network interaction library.
 * @param  {string|int} providerPort The port the provider data API is operating on.
 * @return {Router}       The set-up Express router.
 */
function getRouter(axios, providerPort) {
  if (providerPort === undefined) {
    throw new TypeError('Please specify the port on which to reach the data API.');
  }

  router.get('/', (req, res, next) => {
    dataApi
      .getPlants(axios, providerPort)
      .then((plantList) => wikiApi.attachSummaries(axios, plantList))
      .then((plantList) => res.render('index', { plants: plantList }))
      .catch((err) => next(err));
  });

  return router;
}

module.exports = getRouter;
