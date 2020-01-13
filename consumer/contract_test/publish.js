const path = require('path');
const pact = require('@pact-foundation/pact-node');
const packageJson = require('../../package.json');

const opts = {
  pactFilesOrDirs: [
    path.resolve(__dirname, '../../pacts_consumer'),
  ],
  pactBroker: 'https://test.pact.dius.com.au',
  pactBrokerUsername: 'dXfltyFMgNOFZAxr8io9wJ37iUpY42M',
  pactBrokerPassword: 'O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1',
  tags: ['prod', 'test'],
  consumerVersion: packageJson.version,
};

pact
  .publishPacts(opts)
  .then(() => {
    process.stdout.write('Pact contract publishing complete.\n');
    process.stdout.write('Login to https://test.pact.dius.com.au/ with\n');
    process.stdout.write('=> Username: dXfltyFMgNOFZAxr8io9wJ37iUpY42M\n');
    process.stdout.write('=> Password: O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1\n');
    process.stdout.write('to see the published contracts.\n');
  })
  .catch((err) => {
    process.stderr.write('Pact contract publishing failed: \n');
    process.stderr.write(err);
  });
