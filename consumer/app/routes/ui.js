const express = require('express');

/* eslint-disable new-cap */
const router = express.Router();
/* eslint-enable new-cap */

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
    axios.get(`http://localhost:${providerPort}/plants`)
      .then((response) => {
        const viewData = {
          mainTitle: 'Pollinator Supporting Plants',
          plants: response.data.plants,
        };
        res.render('index', viewData);
      })
      .catch((err) => {
        next(err);
      });
  });

  return router;
}

module.exports = getRouter;
