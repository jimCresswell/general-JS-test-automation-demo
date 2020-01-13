/**
 * Get any relevant contracts (Pact files) from the Pact Broker and
 * verify them against the running provider service.
 */
/* eslint prefer-arrow-callback: off, func-names: off */

const { Verifier } = require('@pact-foundation/pact');
// const chai = require('chai');
// const chaiAsPromised = require('chai-as-promised');
//
// chai.use(chaiAsPromised);

/** @todo Expose data manipulation functions for test state control. */
const app = require('../app/support_species_app.js');

const packageJson = require('../../package.json');

// Provider app config.
const port = 3333;
const providerUrl = `http://localhost:${port}`;
const description = 'Support species app (provider)';


const opts = {
  provider: 'Support Species App (Provider)',
  logLevel: 'INFO',
  providerBaseUrl: providerUrl,

  stateHandlers: {
    'Returns a list of plants': () => Promise.resolve('Control of provider state can go here.'),
  },

  // Fetch pacts from broker
  pactBrokerUrl: 'https://test.pact.dius.com.au/',

  // Fetch from broker with given tags
  consumerVersionTag: ['prod'],

  // Tag provider with given tags
  providerVersionTag: ['prod'],

  // Specific Remote pacts (doesn't need to be a broker)
  /* eslint-disable max-len */
  // pactUrls: ['https://test.pact.dius.com.au/pacts/provider/Support%20Species%20App%20%28Provider%29/consumer/Species%20UI%20App%20%28Consumer%29/latest'],
  /* eslint-enable max-len */
  // Local pacts
  // pactUrls: [
  //   path.resolve(
  //     process.cwd(),
  //     './pacts/matching_service-animal_profile_service.json'
  //   ),
  // ],

  pactBrokerUsername: 'dXfltyFMgNOFZAxr8io9wJ37iUpY42M',
  pactBrokerPassword: 'O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1',
  providerVersion: packageJson.version,

  // Report the verification result to the Pact Broker.
  publishVerificationResult: true,
};


// Verify that the provider meets all consumer expectations
describe('Pact Verification', function () {
  // Start the provider service.
  before(function () {
    this.server = app.listen(port, () => process.stdout.write(
      `${description} running on ${providerUrl}\n`
    ));
  });

  // Stop the provider service.
  after(function () {
    this.server.close();
  });

  // Run the verification.
  it('The expectations of the consumer are met by the provider', function (done) {
    /* eslint-disable no-console */
    new Verifier(opts).verifyProvider()
      .then((output) => {
        console.log('Pact verification complete');
        console.log(output);
        done();
      })
      .catch((err) => {
        console.log('Pact verification error');
        done(err);
      });
    /* eslint-enable no-console */
  });
});
