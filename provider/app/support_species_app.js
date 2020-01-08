const express = require('express');
const morgan = require('morgan');

const app = express();

const initialData = require('../data/pollinator_support_species.json');
const PollinatorSupportList = require('../data/pollinator_support_list.js');

// Start the data store.
const plantList = PollinatorSupportList.initialise(initialData);

// Logging.
app.use(morgan('dev'));

app.use(express.json());

app.get('/plants', (req, res) => {
  const data = plantList.getAll();
  res.json(data);
});

app.post('/plants', (req, res) => {
  const newData = req.body;
  const id = plantList.add(newData);
  res.status(201);
  res.json({ id });
});

app.get('/plants/:id', (req, res) => {
  const { id } = req.params;
  const plantData = plantList.getById(id);
  res.json(plantData);
});

app.delete('/plants/:id', (req, res) => {
  const { id } = req.params;
  const plantData = plantList.deleteById(id);
  plantData.deleted = true;
  res.json(plantData);
});

module.exports = app;
