/**
 * The entry point for starting the provider API service.
 */

const supportSpeciesApp = require('./app/support_species_app');

const port = process.env.PROVIDER_PORT || 3000;

supportSpeciesApp.listen(
  port,
  () => process.stdout.write(`Support species service listening on port ${port}!`)
);
