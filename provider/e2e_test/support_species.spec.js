/**
* E2E tests for the Pollinator Support Species API.
*/
/* eslint prefer-arrow-callback: off, func-names: off */

const request = require('supertest');

// Chai expect for use in custom assertion functions.
const { expect } = require('chai');

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
            .get(PLANTS_ENDPOINT)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
              expect(res.body).to.have.property('name', 'pollinator support species');
            })
            .end(done);
        });
      });

      /* The specs for the POST verb */
      /** @todo consider posting multiple plant entries */
      describe('with POST', function () {
        it('responds with json', function (done) {
          const newData = {
            common_name: 'Snozcumber',
            species: 'Cucumis dahlius',
            link: 'https://en.wikipedia.org/wiki/The_BFG',
          };

          this.request
            .post(PLANTS_ENDPOINT)
            .type('application/json')
            .send(newData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .expect((res) => {
              expect(res.body.id).to.equal(5);
            })
            .end(done);
        });
      });
    });

    /* The specs for the /plants/:id endpoint */
    describe(`${PLANTS_ENDPOINT}/:id`, function () {
      /* The specs for the GET verb */
      describe('with GET', function () {
        it('responds with json', function (done) {
          const id = 1;

          this.request
            .get(`${PLANTS_ENDPOINT}/${id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
              expect(res.body).to.have.property('common_name', 'Purging Buckthorn');
            })
            .end(done);
        });
      });

      /* The specs for the DELETE verb */
      describe('with DELETE', function () {
        it('responds with json', function (done) {
          const id = 3;

          this.request
            .delete(`${PLANTS_ENDPOINT}/${id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((res) => {
              expect(res.body).to.have.property('deleted', true);
              expect(res.body).to.have.property('common_name', 'Goat Willow');
            })
            .end(done);
        });
      });
    });
  }
);
