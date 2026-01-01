@ignore
Feature: form

  Background:
    * def locators = read('classpath:karate/share/locators.json')

  Scenario:
    * input(locators['input'], login)
    * input(locators['password'], password)
    * input(locators['textarea'], textarea)
    * select(locators['number'], number)
    * input(locators['city'], city)
    * screenshot()
    * submit().click(locators['button'])
