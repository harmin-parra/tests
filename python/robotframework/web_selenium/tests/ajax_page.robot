*** Settings ***
Documentation     Testing an AJAX page.
...
...    Issue: https://example.com/JIRA-123
...
...    Test: https://example.com/TEST-456
...
...    Link: http://qa-demo.gitlab.io/reports/web/ajax.html

Resource          ../keywords/ajax.robot
Library           OperatingSystem


*** Test Cases ***
test_ajax_verification
    #[TAGS]
    #...  allure.label.epic:Web interface (Robot Framework / Selenium)
    #...  allure.label.parentSuite:Web interface (Robot Framework / Selenium)
    #...  allure.label.suite:Ajax
    #...  allure.label.story:Ajax
    #...  allure.label.package:web_robotframework.selenium.ajax_test
    #...  allure.label.testMethod:test_ajax_verification

    Open Browser To Ajax Page
    Capture Page Screenshot    EMBED
    Click Page Button
    Capture Page Screenshot    EMBED
    Wait Ajax Response
    Capture Page Screenshot    EMBED
    Verify Ajax Response
    Capture Page Screenshot    EMBED
