@allure.label.parentSuite:Web_interface_(Cucumber)
@allure.label.suite:Web_Form
@allure.label.epic:Web_interface_(Cucumber)
# @allure.links.issue:123
# @allure.links.tms:456
# @allure.links.link:https://www.selenium.dev/selenium/web/web-form.html
Feature: Web Interface

  Scenario: Web Form
    Given The form is empty
    When I fill out the form
    And I click Submit
    Then The form is submitted
