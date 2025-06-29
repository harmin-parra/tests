*** Settings ***
Documentation     The AJAX page object model.
Library           Browser

*** Variables ***
${URL}         http://qa-demo.gitlab.io/reports/web/ajax.html
${BROWSER}     firefox
${DELAY}       0
${HEADLESS}    true


*** Keywords ***
Open Browser To Ajax Page
    New Browser    ${BROWSER}    headless=${HEADLESS}
    New Page    ${URL}
    Ajax Page Should Be Open

Ajax Page Should Be Open
    Get Title    contains    Ajax page

Click Button
    ${element} =    Get Element    \#button
    Click    \#button

Wait Ajax Response
    Wait For Response   **/ajax.txt

Verify Ajax Response
    Get text    \#title    contains    AJAX
