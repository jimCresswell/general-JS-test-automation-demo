const express = require('express');

const axios = require('axios');

/* eslint-disable new-cap */
const router = express.Router();
/* eslint-enable new-cap */


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

module.exports = router;
