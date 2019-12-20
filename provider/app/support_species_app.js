const express = require('express');

const app = express();

const initialData = require('../data/pollinator_support_species.json');
const PollinatorSupportList = require('../data/pollinator_support_list.js');

// Start the data store.
const plantList = PollinatorSupportList.initialise(initialData);

app.get('/plants', (req, res) => {
  const data = plantList.getAll();
  return res.json(data);
});

module.exports = app;
