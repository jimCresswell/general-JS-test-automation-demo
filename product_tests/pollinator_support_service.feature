Feature: The Pollinator Support Service
  As a human
  I want to encourage the survival of pollinator species
  So that we don't run out of food, also I like them.

  Scenario: The Pollinator Support Service main page loads

    Note that these specifcations reflect product level goals rather
    than implementation specific interactions, that detail is in the
    page objects. This keeps the specification accessible to a
    service design or management audience, as well as decoupled from
    implementation changes.

    Given I want to know about plants that support pollinator insect species
    When I look up "Marsh Marigold"
    Then I can see a list of supported pollinators
