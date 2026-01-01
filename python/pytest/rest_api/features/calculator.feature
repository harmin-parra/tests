Feature: Calculator addition

#  Scenario Outline: Add two numbers
#    Given the first number is <a>
#    And the second number is <b>
#    When the numbers are added
#    Then the result should be <result>

#    Examples:
#      | a  | b  | result |
#      | 1  | 2  | 3      |
#      | -1 | 5  | 4      |
#      | 100| 200| 300    |


  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    Then I should be redirected to the dashboard
