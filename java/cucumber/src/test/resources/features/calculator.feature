Feature: Basic Calculator

  Scenario: Add two numbers
    Given a calculator
    When I add 3 and 4
    Then the result should be 7
