/**
* E2E tests for the Pollinator Support Species API.
*/
/* eslint prefer-arrow-callback: off, func-names: off */

const request = require('supertest');

const supportSpeciesApp = require('../app/support_species_app');

const PLANTS_ENDPOINT = '/plants';

describe(
  'The Pollinator Support Species API', function () {
    /* Set up the base request to the API for reuse in tests. */
    before(function () {
      this.request = request(supportSpeciesApp);
    });

    /* The specs for the /plants endpoint */
    describe(`${PLANTS_ENDPOINT}`, function () {
      this.endpoint = PLANTS_ENDPOINT;

      /* The specs for the GET verb */
      describe('with GET', function () {
        it('responds with json', function (done) {
          this.request
            .get('/posts')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
      });

      /* The specs for the POST verb */
      describe('with POST', function () {
        this.data = {
          title: 'My Post',
          body: 'I love JSON.',
          userId: 10,
        };
        it('responds with json', function (done) {
          this.request
            .post('/posts')
            .type('application/json')
            .send(this.data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201, done);
        });
      });
    });
  }
);
