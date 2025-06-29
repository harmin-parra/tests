## Summary

Sample source code of automated test of web pages and a REST api.

The objective is to implement the same tests using different automation test tools and different programming languages.


## Test targets

The web pages under test:

- https://www.selenium.dev/selenium/web/web-form.html
- http://qa-demo.gitlab.io/reports/web/ajax.html

The REST api under test:

- https://restful-api.dev/


## Test reports

https://qa-demo.gitlab.io/reports


## Programming languages

The tests were developed using the following programming languages:
- Python
- Java
- Node.js


## Automation test tools

The tests were developed using:

- For Web tests:
  - [Selenium](https://www.selenium.dev/)
  - [Playwright](https://playwright.dev/)
  - [Cypress](https://www.cypress.io/)
  - [Karate](https://www.karatelabs.io/)
  - [Serenity BDD](https://serenity-bdd.info/)
  - [Robot Framework](https://robotframework.org/)

- For API tests:
  - [Cucumber](https://cucumber.io/)
  - [REST-assured](https://rest-assured.io/)
  - [Karate](https://www.karatelabs.io/)
  - [Serenity BDD](https://serenity-bdd.info/)
  - [Robot Framework](https://robotframework.org/)


## Detail of tools and frameworks

| Category              | Python        | Java          | Node.js       |
|-----------------------|---------------|---------------|---------------|
| Web test tools | <ul><li>Playwright</li> <li>Selenium </li> <li>Robot Framework</li></ul> | <ul><li>Playwright</li> <li>Selenium</li> <li>Karate</li> <li>Serenity BDD</li></ul> | <ul><li>Playwright </li> <li>Cypress</li></ul> |
| REST API test tools   | <ul><li>Behave (Cucumber)</li> <li>Robot Framework</li></ul> | <ul><li>REST-assured</li> <li>Karate</li> <li>Serenity BDD</li></ul> | <ul><li>Cucumber-js (Cucumber)</li></ul> |
| Unit test framework   | Pytest        | JUnit5        | Mocha         |
| Package manager       | pip           | Maven         | npm           |
| Test Reporting Tool   | Allure report | Allure report | Allure report |
| Code repository       | Gitlab        | Gitlab        | Gitlab        |
| Continuos integration | Gitlab-CI     | Gitlab-CI     | Gitlab-CI     |
| Test environment      | Docker        | Docker        | Docker        |
