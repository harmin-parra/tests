Feature: Petstore

  Scenario: Add pet
    Given I have a pet store
    When I add a pet
    Then The pet is added


  Scenario: Get pet
    Given A pet exists in the store
    When I query an existing pet
    Then I get the pet information


  Scenario: Delete pet
    Given A pet exists in the store
    When I delete a pet
    Then The pet is deleted
