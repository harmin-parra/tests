*** Settings ***
Documentation     The AJAX page object model.
Library           SeleniumLibrary

*** Variables ***
${URL}       http://qa-demo.gitlab.io/reports/web/ajax.html
${DRIVER}    headlessfirefox
${DELAY}     0


*** Keywords ***
Open Browser To Ajax Page
    Open Browser    ${URL}    ${DRIVER}
    Maximize Browser Window
    Set Selenium Speed    ${DELAY}
    Ajax Page Should Be Open

Ajax Page Should Be Open
    Title Should Be    Ajax page

Click Page Button
    Click Button    id=button

Wait Ajax Response
    Wait Until Page Contains Element    id=title    15 seconds

Verify Ajax Response
    Element Should Contain    id=title    AJAX
