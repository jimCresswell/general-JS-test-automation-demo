# Consumer: UK Pollinator Supporting Species UI

* Express app, serving a web UI.
* Gets data from the provider data API and the Wikipedia REST API (for creating a media summary for each plant).
* Uses dependency injection for http library calling external APIs (including the provider), this allows easier mocking of remote calls during [end-to-end testing](consumer/e2e_test) of the consumer app.
