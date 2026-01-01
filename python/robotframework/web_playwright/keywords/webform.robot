*** Settings ***
Documentation     The webform page object model.
Library           Browser

*** Variables ***
${URL}         https://www.selenium.dev/selenium/web/web-form.html
${BROWSER}     firefox
${DELAY}       0
${HEADLESS}    true


*** Keywords ***
Open Browser To Web Form Page
    New Browser    ${BROWSER}    headless=${HEADLESS}
    New Page    ${URL}
    Web form Page Should Be Open

Web form Page Should Be Open
    Get Title    contains    Web form

Set Login
    [Arguments]    ${var}
    ${element} =    Get Element   input[name='my-text']
    Type Text    ${element}    ${var}

Set Password
    [Arguments]    ${var}
    ${element} =    Get Element   input[name='my-password']
    Type Text    ${element}    ${var}

Set TextArea
    [Arguments]    ${var}
    ${element} =    Get Element   textarea[name='my-textarea']
    Type Text    ${element}    ${var}

Set Number
    [Arguments]    ${var}
    ${element} =    Get Element    select[name='my-select']
    Select Options By    ${element}    Index    ${var}

Set City
    [Arguments]    ${var}
    ${element} =    Get Element    input[name='my-datalist']
    Type Text    ${element}    ${var}

Upload File
    [Arguments]    ${var}
    Upload File By Selector    input[name='my-file']    ${var}

Set Color
    [Arguments]    ${var}
    ${element} =    Get Element   input[name='my-colors']
    Evaluate JavaScript    ${element}    (elem, arg) => { elem.value = arg; }    arg=${var}

Set Date
    [Arguments]    ${var}
    ${element} =    Get Element   input[name='my-date']
    Evaluate JavaScript    ${element}    (elem, arg) => { elem.value = arg; }    arg=${var}

Set Range
    [Arguments]    ${var}
    ${element} =    Get Element   input[name='my-range']
    Fill Text    ${element}    ${var}
    #Evaluate JavaScript    ${element}    (elem, arg) => { elem.value = arg; }    arg=${var}

Submit Form
    ${element} =    Get Element   button[type='submit']
    Click    ${element}

Success Page Should Be Displayed
    Get text    //h1    contains    Form submitted


*** Keywords ***
Ouvrir le navigateur et afficher le formulaire web
    New Browser    ${BROWSER}    headless=true
    New Page    ${URL}
    Le formulaire est affichée

Le formulaire est affichée
    Get Title    contains    Web form

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
    Set Number    ${var}

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

Sélectionner range
    [Arguments]    ${var}
    Set Range    ${var}

Envoyer le formulaire
    Submit form

La page de confimation est affichée
    Success Page Should Be Displayed
