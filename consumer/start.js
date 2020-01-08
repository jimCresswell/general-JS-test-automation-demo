const axios = require('axios');
const getApp = require('./app/species_ui_app');

const port = process.env.CONSUMER_PORT || 3002;

// Get the provider port, for configurng the data API calls.
const providerPort = process.env.PROVIDER_PORT || 3001;

const description = 'Species UI (consumer)';

const app = getApp(axios, providerPort);
app.listen(port, () => {
  process.stdout.write(
    `${description} running on http://localhost:${port}\n`
  );
});
