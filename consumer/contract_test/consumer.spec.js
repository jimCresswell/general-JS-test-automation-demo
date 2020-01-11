
/**
 * The consumer side of the consumer driven contract tests.
 */

/* eslint prefer-arrow-callback: off, func-names: off */

const path = require('path');
const axios = require('axios');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Pact, Matchers } = require('@pact-foundation/pact');

chai.use(chaiAsPromised);
const { expect } = chai;

const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';

// Configure and import consumer API
// Note that we update the API endpoint to point at the Mock Service
const { getPlants } = require('../app/models/data_api');

describe('Pact', () => {
  const provider = new Pact({
    consumer: 'Matching Service',
    provider: 'Animal Profile Service',
    // port: 1234, // Port for the mock provider. Set here or dynamically in `setup` below.
    log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: LOG_LEVEL,
    spec: 2,
  });

  // Alias flexible matchers for simplicity
  const {
    eachLike,
    like,
    term,
    iso8601DateTimeWithMillis,
  } = Matchers;

  const MIN_NUM_POLLINATORS = 5;

  // Define animal payload, with flexible matchers
  //
  // This makes the test much more resilient to changes in actual data.
  // Here we specify the 'shape' of the object that we care about.
  // It is also import here to not put in expectations for parts of the
  // API we don't care about
  const animalBodyExpectation = {
    id: like(1),
    available_from: iso8601DateTimeWithMillis(),
    first_name: like('Billy'),
    last_name: like('Goat'),
    animal: like('goat'),
    age: like(21),
    gender: term({
      matcher: 'F|M',
      generate: 'M',
    }),
    location: {
      description: like('Melbourne Zoo'),
      country: like('Australia'),
      post_code: like(3000),
    },
    eligibility: {
      available: like(true),
      previously_married: like(false),
    },
    interests: eachLike('walks in the garden/meadow'),
  };

  // Define animal list payload, reusing existing object matcher
  const animalListExpectation = eachLike(animalBodyExpectation, {
    min: MIN_NUM_POLLINATORS,
  });

  // Setup a Mock Server before unit tests run.
  // This server acts as a Test Double for the real Provider API.
  // We then call addInteraction() for each test to configure the Mock Service
  // to act like the Provider
  // It also sets up expectations for what requests are to come, and will fail
  // if the calls are not seen.
  before(function () {
    provider.setup()
      // Get the dynamic port assigned to the mock provider.
      .then((opts) => { this.providerPort = opts.port; });
  });

  // After each individual test (one or more interactions)
  // we validate that the correct request came through.
  // This ensures what we _expect_ from the provider, is actually
  // what we've asked for (and is what gets captured in the contract)
  afterEach(() => provider.verify());

  // Verify service client works as expected.
  //
  // Note that we don't call the consumer API endpoints directly, but
  // use unit-style tests that test the collaborating function behaviour -
  // we want to test the function that is calling the external service.
  describe('when a call to list all animals from the Animal Service is made', function () {
    describe('and the user is authenticated', function () {
      describe('and there are animals in the database', function () {
        before(function () {
          provider.addInteraction({
            state: 'Has some animals',
            uponReceiving: 'a request for all animals',
            withRequest: {
              method: 'GET',
              path: '/animals/available',
              headers: { Authorization: 'Bearer token' },
            },
            willRespondWith: {
              status: 200,
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
              },
              body: animalListExpectation,
            },
          });
        });

        it('returns a list of animals', function (done) {
          const httpLibrary = axios;
          const port = this.providerPort;
          const onError = function (err) { throw new Error(err); };
          const plantList = getPlants(httpLibrary, port, onError);

          expect(plantList).to.eventually.have.deep.property(
            'suggestions[0].score',
            94
          );
          expect(plantList)
            .to.eventually.have.property('suggestions')
            .with.lengthOf(MIN_NUM_POLLINATORS)
            .notify(done);
        });
      });
    });
  });

  // Write pact files
  after(() => provider.finalize());
});
