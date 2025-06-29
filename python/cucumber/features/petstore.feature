@allure.link.REST_API_specification:https://petstore.swagger.io/
@allure.issue.JIRA-123:https://example.com/JIRA-123
@allure.tms.TEST-456:https://example.com/TEST-456
@allure.label.parentSuite:REST_api_Cucumber
@allure.label.suite:Petstore
@allure.label.epic:REST_api_Cucumber
@allure.label.package:rest_api.petstore
Feature: Petstore

  Scenario: Add pet
    Given I have a pet store
    When I add a pet
    Then The pet is added


  Scenario: Get pet
    Given A pet exists in the store
    When I query a pet
    Then I get the pet information


  Scenario: Delete pet
    Given A pet exists in the store
    When I delete a pet
    Then The pet is deleted


#  Scenario: Update existing pet
#    Given A pet exists in the store
#    When I update a pet
#    Then The pet is updated
