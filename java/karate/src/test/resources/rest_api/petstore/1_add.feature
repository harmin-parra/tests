Feature: Petstore

  Background:
    * url url_rest_api

  @allure.label.epic:REST_api_(Karate)
  @allure.label.suite:REST_api_(Karate)
  Scenario: Add pet
    * def payload =
      """
      {
        "id": 5432,
        "name": "doggie",
        "status": "available"
      }
      """
    Given url url_rest_api
    And request payload
    When method post
    * def id = response.id
    Then status 200
    And match response contains {id: 5432}
    And match response contains {name: "doggie"}
    And match response contains {status: "available"}
