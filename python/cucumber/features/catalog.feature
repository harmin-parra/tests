@allure.link.REST_API_specification:https://restful-api.dev/
@allure.issue.JIRA-123:https://example.com/JIRA-123
@allure.tms.TEST-456:https://example.com/TEST-456
@allure.label.parentSuite:REST_api_Cucumber
@allure.label.suite:Catalogue
@allure.label.epic:REST_api_Cucumber
@allure.label.package:rest_api.catalogue
Feature: Catalogue

  Scenario: Add object
    Given I have a catalogue
    When I add an object
    Then The object is added


  Scenario: Get object
    Given An object exists in the catalogue
    When I query an object
    Then I get the object information


  Scenario: Delete object
    Given An object exists in the catalogue
    When I delete an object
    Then The object is deleted
