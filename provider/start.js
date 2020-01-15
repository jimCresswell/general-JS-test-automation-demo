const app = require('./app/support_species_app');
const { defaults } = require('../package.json');

const providerPort = process.env.PROVIDER_PORT || defaults.providerPort;

const description = 'Support species app (provider)';

app.listen(providerPort, () => {
  process.stdout.write(
    `${description} running on http://localhost:${providerPort}\n`
  );
});
