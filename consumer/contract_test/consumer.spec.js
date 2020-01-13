
/**
 * The consumer side of the consumer driven contract tests.
 *
 * Created with PactJS https://github.com/pact-foundation/pact-js .
 */

/* eslint prefer-arrow-callback: off, func-names: off */

const path = require('path');
const axios = require('axios');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Pact, Matchers } = require('@pact-foundation/pact');

// Configure and import the consumer API.
const { getPlants } = require('../app/models/data_api');

chai.use(chaiAsPromised);
const { expect } = chai;

const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';


// Configure the Pact framework and get the `provider` object which allows
// us to later specify the expected consumer-provider interactions including
// the mock return data.
const provider = new Pact({
  consumer: 'Species UI App (Consumer)',
  provider: 'Support Species App (Provider)',
  // port: 1234, // Port for the mock provider. Set here or dynamically in `setup` below.
  log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
  dir: path.resolve(process.cwd(), 'pacts_consumer'),
  logLevel: LOG_LEVEL,
  spec: 2,
});

// Alias some Pact flexible matchers for use in specifying mock return data.
// See https://github.com/pact-foundation/pact-js#match-common-formats .
const {
  integer,
  boolean,
  string,
  like,
  eachLike,
} = Matchers;

/*
  Define the expected payload from the mock provider.

  Using Flexible matchers to specify constraints on returned values
  makes the test much more resilient to changes in real data. Matchers
  can be for specific data type e.g. `string`, or infer the data type
  from the argument using `like`. `eachLike` infers an array like the
  specified data.

  It is important to only specify or constrain parts of the data
  the consumer cares about. The can and should be safely ignored,
  this prevents the produced contracts (pacts) creating unnecessary
  constraints on the specifed relationship between the
  consumer and  provider systems.
*/
const plantExpectation = {
  id: integer(1),
  common_name: string('Purging Buckthorn'),
  species: like('Rhamnus cathartica'),
  perennial: boolean(true),
  wikilink: like('https://en.wikipedia.org/wiki/Rhamnus_cathartica'),
  notes: like('One of only two support species for the Brimstone butterfly.'),
  supports: eachLike(
    {
      common_name: like('Brimstone Butterfly'),
      species: like('Gonepteryx rhamni'),
      wikilink: like('https://en.wikipedia.org/wiki/Gonepteryx_rhamni'),
    }
  ),
};

/*
  Define plant list expectation. Note it specifies the array of plants
  but not e.g. the list-level name or description fields
  (see provider/data/pollinator_support_species.json) as they are not
  used in the consumer.
*/
const MIN_NUM_POLLINATORS = 5;
const plantListExpectation = {
  plants: eachLike(plantExpectation, { min: MIN_NUM_POLLINATORS }),
};

// Describe the tests.
describe('Pact:', function () {
  /*
    Setup a server to return the mock provider data.

    The `provider.addInteraction` function is later called for each test
    to specify the interactions with the mock for that test. The test will
    fail if the expected interactions are not seen when checked
    with `provider.verify`.
   */
  before(function (done) {
    provider.setup()
      // Get the dynamic port assigned to the mock provider
      // so we can tell the consumer which port to use.
      .then((opts) => { this.providerPort = opts.port; })
      .then(() => {
        // Tell Mocha the asynch set up is finished.
        done();
      });
  });

  /*
    After each test with at least one interaction a check is made that the
    mock provider received the expected requests. This means we know that

      * the request for our expected mock payload (from the consumer product code),
        matches the specification below
      * and, given the specifed mock return value, the consumer
        behaves as expected.

   Those pieces of information are sufficient to construct a valid interaction
   contract (pact) which can be used by the provider to check that a given
   version of the API will satisfy the needs of this version of the consumer.
   */
  afterEach(() => provider.verify());

  // After all the tests:
  // write the created contracts to pact files for sharing with the provider.
  after(() => provider.finalize());

  /*
    Verify that the consumer code, which interacts with the provider, functions
    as expected given our specification of the expected returned mock data.

    Depending on the consumer code design this could be seen as a unit
    or integration test.
   */
  describe('The Consumer Species UI App', function () {
    describe('can get a list of plants', function () {
      describe('and handle success', function () {
        // Set up the expected response from the mock provider.
        before(function () {
          provider.addInteraction({
            state: 'Returns a list of plants',
            uponReceiving: 'a request for the plants list',
            withRequest: {
              method: 'GET',
              path: '/plants',
            },
            willRespondWith: {
              status: 200,
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
              },
              body: plantListExpectation,
            },
          });
        });

        /*
        The first actual test.  The tests in combination with the verify step
        (to verify the expected request was made to the mock provider), are
        enough information to create the contract (pact) for sharing.
        */
        it('gets plant list.', function () {
          const httpLibrary = axios;
          const port = this.providerPort;
          const onError = function (err) { throw new Error(err); };
          const plantList = getPlants(httpLibrary, port, onError);

          return expect(plantList)
            .to.eventually.have.lengthOf(MIN_NUM_POLLINATORS)
            .and.have.nested.property(
              '[0].common_name',
              'Purging Buckthorn'
            );
        });
      });
    });
  });
});
