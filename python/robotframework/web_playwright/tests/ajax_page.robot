*** Settings ***
Documentation     Testing an Ajax page.
...
...    Issue: https://example.com/JIRA-123
...
...    Test: https://example.com/TEST-456
...
...    Link: http://qa-demo.gitlab.io/reports/web/ajax.html

Resource          ../keywords/ajax.robot
Library     AllureLibrary


*** Test Cases ***
test_ajax_verification
    [Documentation]     Testing an Ajax page.
    ...
    ...    Issue: https://example.com/JIRA-123
    ...
    ...    Test: https://example.com/TEST-456
    ...
    ...    Link: http://qa-demo.gitlab.io/reports/web/ajax.html
    #[TAGS]
    #...  allure.label.epic:Web interface (Robot Framework / Playwright)
    #...  allure.label.parentSuite:Web interface (Robot Framework / Playwright)
    #...  allure.label.suite:Ajax
    #...  allure.label.story:Ajax
    #...  allure.label.package:web_robotframework.playwright.ajax_test
    #...  allure.label.testMethod:test_ajax_verification

    Open Browser To Ajax Page
    Take Screenshot    EMBED    fullPage=True
    Click Button
    Take Screenshot    EMBED    fullPage=True
    Wait Ajax Response
    Take Screenshot    EMBED    fullPage=True
    Verify Ajax Response
