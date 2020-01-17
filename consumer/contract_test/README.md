# Consumer Driven Contract Tests

Uses Pact, Mocha and Chai to exercise tests against a mock provider service. By specifying request response pairs the code defines a contract of expectations between the consumer and the provider, the tests assert that given the contract the consumer behaves as expected and the `verify` step verifies that the tests made the expected requests.

The contract can then be sent to the provider, in this case using a third party Pact broker service, and used to verify which versions of the provider satisfy which versions of the consumer expectations. The result of that verification can then optionally be published back to the broker service, making the verification visible to the consumer team.

The provider-side verification can be carried out against contracts from any number of consumers, telling the provider team which parts of the API are being used (assuming the consumers publish their contracts) and whether or not a change will be breaking and for whom _before it is released_.

Note that the consumer contract tests here test the relationship between one consumer and provider pair, ignoring other providers (in this case Wikipedia). Additionally only the parts of the provider API (and returned data structures) that are used by the consumer are tested, the constraints set by the consumer in the contract are kept to the absolute minimum required to ensure proper consumer operation, reducing incorrect reporting of breaking API changes (and not straining the collaborative relationship with the provider team).
