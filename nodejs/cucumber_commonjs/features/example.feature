Feature: Example Feature

  @allure.label.epic:WebInterface
  @allure.label.story:Authentication
  @allure.label.parentSuite:TestsForWebInterface
  @allure.label.suite:TestsForEssentialFeatures
  Scenario: Visit Google
    Given I open Google's homepage
    Then the title should contain "Google"
