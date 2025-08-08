*** Settings ***
Documentation     Testing the following field types of a webform :
...
...    - Input text
...    - Text area
...    - Select
...    - Checkbox
...    - Radio button
...    - File upload
...    - Color picker
...    - Date picker
...    - Input range
...    - Button
...
...    Issue: https://issues.example.com/JIRA-123
...
...    Test: https://tms.example.com/TEST-456
...
...    Link: https://www.selenium.dev/selenium/web/web-form.html

Resource          ../keywords/webform.robot
Library           AllureLibrary
Library           OperatingSystem


*** Test Cases ***
test_web_form_en
    [Documentation]     Testing the following field types of a webform :
    ...
    ...    - Input text
    ...    - Text area
    ...    - Select
    ...    - Checkbox
    ...    - Radio button
    ...    - File upload
    ...    - Color picker
    ...    - Date picker
    ...    - Input range
    ...    - Button
    ...
    ...    Issue: https://issues.example.com/JIRA-123
    ...
    ...    Test: https://tms.example.com/TEST-456
    ...
    ...    Link: https://www.selenium.dev/selenium/web/web-form.html
    #[TAGS]
    #...  allure.label.epic:Web interface (Robot Framework / Playwright)
    #...  allure.label.parentSuite:Web interface (Robot Framework / Playwright)
    #...  allure.label.suite:Web Form
    #...  allure.label.story:Web Form
    #...  allure.label.package:web_robotframework.playwright.webform_test
    #...  allure.label.testMethod:test_web_form_en

    Open Browser To Web Form Page
    Take Screenshot   EMBED    fullPage=True
    Set Login    login
    Set Password    password
    Set TextArea    Hello, World!
    Set Number    2
    Set City    Los Angeles
    Upload File    /tmp/file.xml
    Log File    /tmp/file.xml
    Set Color    \#00FF00
    Set Date    01/01/2024
    Set Range    1
    Take Screenshot   EMBED    fullPage=True
    Submit Form
    Take Screenshot   EMBED    fullPage=True
    Success Page Should Be Displayed


*** Test Cases ***
test_web_form_fr
    [Documentation]     Test d'un formulaire web avec les champs suivants :
    ...
    ...    - Input text
    ...    - Text area
    ...    - Select
    ...    - Checkbox
    ...    - Radio button
    ...    - File upload
    ...    - Color picker
    ...    - Date picker
    ...    - Input range
    ...    - Button
    ...
    ...    Bogue: https://example.com/JIRA-123
    ...
    ...    Test: https://example.com/TEST-456
    ...
    ...    Lien: https://www.selenium.dev/selenium/web/web-form.html
     #[TAGS]
    #...  allure.label.epic:Web interface (Robot Framework / Playwright)
    #...  allure.label.parentSuite:Web interface (Robot Framework / Playwright)
    #...  allure.label.suite:Web Form
    #...  allure.label.story:Web Form
    #...  allure.label.package:web_robotframework.playwright.webform_test
    #...  allure.label.testMethod:test_web_form_fr

    Ouvrir le navigateur et afficher le formulaire web
    Take Screenshot   EMBED    fullPage=True
    Saisir identifiant    login
    Saisir mot de passe    password
    Ecrire texte    Hello, World!
    Sélectionner le nombre    2
    Sélectionner la ville    Los Angeles
    Charger le fichier    /tmp/file.xml
    Log File    /tmp/file.xml
    Choisir la coleur    \#00FF00
    Sélectionner la date    01/01/2024
    Sélectionner range    1
    Take Screenshot   EMBED    fullPage=True
    Envoyer le formulaire
    Take Screenshot   EMBED    fullPage=True
    La page de confimation est affichée
