const express = require('express');

/* eslint-disable new-cap */
const router = express.Router();
/* eslint-enable new-cap */


router.get('/', (req, res) => {
  const viewData = {
    mainTitle: 'Hello plants',
    content: 'Plants are great',
  };

  res.render('index', viewData);
});

module.exports = router;
