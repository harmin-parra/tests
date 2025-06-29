Feature: Petstore

  Background:
    * url url_rest_api

  @allure.label.epic:REST_api_(Karate)
  @allure.label.suite:REST_api_(Karate)
  Scenario: Delete pet
    Given path '5432'
    When method delete
    Then status 200
    And match response contains {message: '5432'}

    Given path '5432'
    When method get
    Then status 404
    And match response contains {type: 'error'}
    And match response contains {message: 'Pet not found'}
