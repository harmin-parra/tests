*** Settings ***
Documentation     The webform page object model.
Library           SeleniumLibrary

*** Variables ***
${URL}       https://www.selenium.dev/selenium/web/web-form.html
${DRIVER}    headlessfirefox
${DELAY}     0


*** Keywords ***
Open Browser To Web Form Page
    Open Browser    ${URL}    ${DRIVER}
    Maximize Browser Window
    Set Selenium Speed    ${DELAY}
    Web form Page Should Be Open

Web form Page Should Be Open
    Title Should Be    Web form

Set Login
    [Arguments]    ${var}
    Input Text    name=my-text    ${var}

Set Password
    [Arguments]    ${var}
    Input Text    name=my-password    ${var}

Set TextArea
    [Arguments]    ${var}
    Input Text    name=my-textarea    ${var}

Set Number
    [Arguments]    ${var}
    Select From List By Index    name=my-select    ${var}

Set City
    [Arguments]    ${var}
    Input Text    name=my-datalist    ${var}
    Click Element   //body

Upload File
    [Arguments]    ${var}
    Choose File    name=my-file    ${var}

Set Color
    [Arguments]    ${var}
    Execute Javascript    document.getElementsByName('my-colors')[0].value = arguments[0]    ARGUMENTS    ${var}

Set Date
    [Arguments]    ${var}
    Input Text    name=my-date    ${var}
    Click Element   //body

Set Range
    [Arguments]    ${var}
    Execute Javascript    document.getElementsByName('my-range')[0].value = arguments[0]    ARGUMENTS    ${var}

Submit form
    Click Button    //button[@type='submit']

Success Page Should Be Displayed
    Page Should Contain    Form submitted






Ouvrir le navigateur et afficher le formulaire web
    Open Browser To Web Form Page

Saisir identifiant
    [Arguments]    ${var}
    Set Login    ${var}

Saisir mot de passe
    [Arguments]    ${var}
    Set Password    ${var}

Ecrire texte
    [Arguments]    ${var}
    Set TextArea    ${var}

Sélectionner le nombre
    [Arguments]    ${var}
    Set number    ${var}

Sélectionner la ville
    [Arguments]    ${var}
    Set City    ${var}

Charger le fichier
    [Arguments]    ${var}
    Upload File    ${var}

Choisir la coleur
    [Arguments]    ${var}
    Set Color    ${var}

Sélectionner la date
    [Arguments]    ${var}
    Set Date    ${var}

Sélectionner Range
    [Arguments]    ${var}
    Execute Javascript    document.getElementsByName('my-range')[0].value = arguments[0]    ARGUMENTS    ${var}

Envoyer le formulaire
    Submit form

La page de confimation est affichée
    Success Page Should Be Displayed

