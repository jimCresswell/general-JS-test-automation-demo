const app = require('./app/support_species_app');

const defaultPort = 3001;
const port = process.env.PROVIDER_PORT || defaultPort;

const description = 'Support species app (provider)';

app.listen(port, () => {
  process.stdout.write(
    `${description} running on http://localhost:${port}\n`
  );
});
