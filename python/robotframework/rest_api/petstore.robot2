*** Settings ***
Library         REST    https://petstore.swagger.io/v2/pet/

*** Variables ***
${payload}     { "id": 5432, "name": "doggie", "status": "available" }
${id}              5432


*** Test Cases ***

Add a pet
    #[TAGS]
    #...  allure.label.epic:REST_api (Robot Framework)
    #...  allure.label.parentSuite:REST_api (Robot Framework)
    #...  allure.label.suite:REST_api
    #...  allure.label.story:Petstore
    #...  allure.label.package:rest_api.petstore
    #...  allure.label.testMethod:add_pet
    POST    /    ${payload}
    Log    Payload: ${payload}
    #Set Test Message    Payload: ${payload}
    Output schema    response body
    Integer    response status    200
    [Teardown]  Output schema


Get an existing pet
    #[TAGS]
    #...  allure.label.epic:REST_api (Robot Framework)
    #...  allure.label.parentSuite:REST_api (Robot Framework)
    #...  allure.label.suite:REST_api
    #...  allure.label.story:Petstore
    #...  allure.label.package:rest_api.petstore
    #...  allure.label.testMethod:get_existing_pet
    GET         /${id}
    Output schema   response body
    Integer     response status         200
    Object      response body
    Integer     response body id        ${id}
    String      response body name      doggie
    String      response body status    available
    [Teardown]  Output schema


Delete a pet
    #[TAGS]
    #...  allure.label.epic:REST_api (Robot Framework)
    #...  allure.label.parentSuite:REST_api (Robot Framework)
    #...  allure.label.suite:REST_api
    #...  allure.label.story:Petstore
    #...  allure.label.package:rest_api.petstore
    #...  allure.label.testMethod:delete_pet
    DELETE    /${id}
    Output schema   response body
    Integer    response status    200
    [Teardown]  Output schema


Get an unexisting pet
    #[TAGS]
    #...  allure.label.epic:REST_api (Robot Framework)
    #...  allure.label.parentSuite:REST_api (Robot Framework)
    #...  allure.label.suite:REST_api
    #...  allure.label.story:Petstore
    #...  allure.label.package:rest_api.petstore
    #...  allure.label.testMethod:get_unexisting_pet
    GET         /${id}
    Output schema   response body
    Integer    response status          404
    String     response body type       error
    String     response body message    Pet not found
    [Teardown]  Output schema
