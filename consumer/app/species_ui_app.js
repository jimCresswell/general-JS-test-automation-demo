const path = require('path');
const fs = require('fs');

const express = require('express');
const morgan = require('morgan');
const hbs = require('hbs');

const uiRoutes = require('./routes/ui');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Process the partials from disk synchronoulsy, otherwise
// supertest requests fail because partials aren't
// processed yet. Happens once at startup so minimal
// performance impact.
const partialsPath = path.resolve(__dirname, 'views', 'partials');
const partialFileNames = fs.readdirSync(partialsPath);
partialFileNames.forEach((fileName) => {
  const partialName = fileName
    .replace('.hbs', '')
    .replace(/[ -]/g, '_');
  const partial = fs.readFileSync(path.resolve(partialsPath, fileName), 'utf8');
  hbs.registerPartial(partialName, partial);
});

// Logging.
app.use(morgan('combined'));

app.use('/', uiRoutes);

app.use((req, res) => {
  res.status(404)
    .render('four_oh_four');
});

module.exports = app;
