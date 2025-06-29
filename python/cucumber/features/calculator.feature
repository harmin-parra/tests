@allure.label.epic:Calculator
@allure.label.package:calculator
Feature: Arithmetic_operations

  @allure.label.story:Addition
  @allure.label.parentSuite:Cucumber
  @allure.label.suite:Calculator
  @allure.label.testClass:calculator
  @allure.label.testMethod:add()
  Scenario Outline: Addition
    Given I have a calculator
    When I add "<x>" and "<y>"
    Then the calculator returns "<sum>"

    Examples:
      |  x  |  y | sum |
      |  1  |  1 |  2  |
      |  2  |  1 |  3  |
      |  2  |  7 |  9  |
