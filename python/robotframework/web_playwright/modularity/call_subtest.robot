*** Settings ***
Documentation     Testing the fill-in and submit of a web form.

Resource          ../keywords/webform.robot
Resource          ../keywords/subtest.robot
Library     Browser

*** Test Cases ***
test_web_form_subtest
    Open Browser To Web Form Page
    Take Screenshot   EMBED    fullPage=True
    Fill in Webform    login    password    Hello, World!    2    Los Angeles    /tmp/file.xml    \#00FF00    01/01/2024    1
    Take Screenshot   EMBED    fullPage=True
    Success Page Should Be Displayed
