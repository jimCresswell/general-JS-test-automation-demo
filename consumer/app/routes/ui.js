const express = require('express');

/* eslint-disable new-cap */
const router = express.Router();
/* eslint-enable new-cap */

/**
 * Get the router for these routes, allows dependency injection.
 * @param  {Object} axios A network interaction library.
 * @return {Router}       The set-up Express router.
 */
function getRouter(axios) {
  router.get('/', (req, res, next) => {
    axios.get('http://localhost:3001/plants')
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
