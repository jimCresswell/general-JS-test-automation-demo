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
      .getPlants(axios, providerPort, next)
      .then((plantData) => wikiApi.attachSummaries(axios, plantData))
      .then((plantData) => res.render('index', { plants: plantData }))
      .catch((err) => next(err));
  });

  return router;
}

module.exports = getRouter;
