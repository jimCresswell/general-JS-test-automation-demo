const axios = require('axios');
const getApp = require('./app/species_ui_app');

const defaultPort = 3002;
const port = process.env.CONSUMER_PORT || defaultPort;

const description = 'Species UI (consumer)';

const app = getApp(axios);
app.listen(port, () => {
  process.stdout.write(
    `${description} running on http://localhost:${port}\n`
  );
});
