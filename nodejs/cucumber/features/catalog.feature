@allure.label.parentSuite:REST_api_Cucumber
@allure.label.suite:Catalogue
@allure.label.epic:REST_api_Cucumber
@allure.label.package:rest_api.catalogue
Feature: Catalog

  Scenario: Add object
    Given I have a catalog
    When I add an object
    Then The object is added


  Scenario: Get object
    Given An object exists in the catalog
    When I query an existing object
    Then I get the object information


  Scenario: Delete object
    Given An object exists in the catalog
    When I delete an object
    Then The object is deleted
