*** Settings ***
Documentation     Testing the fill-in and submit of a web form.

Resource          webform.robot
Library           SeleniumLibrary


*** Keywords ***
Fill in Webform
    [Arguments]    ${login}    ${password}    ${textarea}    ${number}    ${city}    ${file}    ${color}    ${date}    ${range}
    Set Login    ${login}
    Set Password    ${password}
    Set TextArea    ${textarea}
    Set Number    ${number}
    Set City    ${city}
    Upload File    ${file}
    Set Color    ${color}
    Set Date    ${date}
    Set Range    ${range}
