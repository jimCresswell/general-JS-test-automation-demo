const path = require('path');
const fs = require('fs');

const express = require('express');
const morgan = require('morgan');
const hbs = require('hbs');

const getUiRouter = require('./routes/ui');

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

/**
 * Get the Express app, allows dependency injection.
 * @param  {Object} axios A network interaction library.
 * @param  {string|int} providerPort The port the provider data API is operating on.
 * @return {App}       The configured Express app.
 */
function getApp(axios, providerPort) {
  // Logging.
  app.use(morgan('dev'));

  app.use('/', getUiRouter(axios, providerPort));

  app.use((req, res) => {
    res.status(404)
      .render('four_oh_four');
  });

  return app;
}

module.exports = getApp;
