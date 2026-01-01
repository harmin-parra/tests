Feature: Petstore

  Background:
    * url url_rest_api

  @allure.label.epic:REST_api_(Karate)
  @allure.label.suite:REST_api_(Karate)
  Scenario: Get pet
    Given path '5432'
    When method get
    Then status 200
    And match response contains {id: 5432}
    And match response contains {name: "doggie"}
    And match response contains {status: "available"}
