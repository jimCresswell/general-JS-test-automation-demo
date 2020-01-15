const axios = require('axios');
const getApp = require('./app/species_ui_app');
const { defaults } = require('../package.json');

const consumerPort = process.env.PORT || process.env.CONSUMER_PORT || defaults.consumerPort;

// Get the provider port, for configurng the data API calls.
const providerPort = process.env.PROVIDER_PORT || defaults.providerPort;

const description = 'Species UI (consumer)';

const app = getApp(axios, providerPort);
app.listen(consumerPort, () => {
  process.stdout.write(
    `${description} running on http://localhost:${consumerPort}\n`
  );
});
