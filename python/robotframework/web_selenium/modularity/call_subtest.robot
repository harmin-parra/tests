*** Settings ***
Documentation     Testing the fill-in and submit of a web form.

Resource          ../keywords/webform.robot
Resource          ../keywords/subtest.robot
Library           SeleniumLibrary

*** Test Cases ***
test_web_test_subtest
    Open Browser To Web Form Page
    Capture Page Screenshot    EMBED
    Fill in Webform    login    password    Hello, World!    2    Los Angeles    /tmp/file.xml    \#00FF00    01/01/2024    1
    Capture Page Screenshot    EMBED
    Submit Form
    Capture Page Screenshot    EMBED
    Success Page Should Be Displayed
