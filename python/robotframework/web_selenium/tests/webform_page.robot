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
Library           OperatingSystem


*** Test Cases ***
test_web_form_en
    [TAGS]
    #...  allure.label.epic:Web interface (Robot Framework / Selenium)
    #...  allure.label.parentSuite:Web interface (Robot Framework / Selenium)
    #...  allure.label.suite:Web Form
    #...  allure.label.story:Web Form
    #...  allure.label.package:web_robotframework.selenium.webform_test
    #...  allure.label.testMethod:test_web_form_en

    Open Browser To Web Form Page
    Capture Page Screenshot    EMBED
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
    Capture Page Screenshot    EMBED
    Submit Form
    Capture Page Screenshot    EMBED
    Success Page Should Be Displayed
    [Teardown]    Close Browser


test_web_form_fr
    [TAGS]
    #...  allure.label.epic:Web interface (Robot Framework / Selenium)
    #...  allure.label.parentSuite:Web interface (Robot Framework / Selenium)
    #...  allure.label.suite:Web Form
    #...  allure.label.story:Web Form
    #...  allure.label.package:web_robotframework.selenium.webform_test
    #...  allure.label.testMethod:test_web_form_fr
    Ouvrir le navigateur et afficher le formulaire web
    Capture Page Screenshot    EMBED
    Saisir identifiant    login
    Saisir mot de passe    password
    Ecrire texte    Hello, World!
    Sélectionner le nombre    2
    Sélectionner la ville    Los Angeles
    Charger le fichier    /tmp/file.xml
    Log File    /tmp/file.xml
    Choisir la coleur    \#00FF00
    Sélectionner la date    01/01/2024
    Sélectionner Range    1
    Capture Page Screenshot    EMBED
    Envoyer le formulaire
    Capture Page Screenshot    EMBED
    La page de confimation est affichée
    [Teardown]    Close Browser
