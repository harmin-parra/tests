*** Settings ***
Documentation     Testing a REST API.
...
...    Issue: https://issues.example.com/JIRA-123
...
...    Test: https://tms.example.com/TEST-456
...
...    Link: https://restful-api.dev/

Library         REST    https://api.restful-api.dev/objects


*** Variables ***
${payload}     {"name": "Lenovo notebook", "data": {"year": 2019, "price": 1849.99, "CPU model": "Intel Core i9", "Hard disk size": "1 TB"}}


*** Test Cases ***
Add an object
    #[TAGS]
    #...  allure.label.epic:REST_api (Robot Framework)
    #...  allure.label.parentSuite:REST_api (Robot Framework)
    #...  allure.label.suite:REST_api
    #...  allure.label.story:Catalogue
    #...  allure.label.package:rest_api.petstore
    #...  allure.label.testMethod:add_object
    #Set Headers    {"Content-Type": "application/json"}
    &{res} =    POST    https://api.restful-api.dev/objects    ${payload}
    Log    Payload: ${payload}
    #Set Test Message    Payload: ${payload}
    Output     request body
    Output     response body
    Output schema    response body
    Integer    response status    200
    VAR    ${id}    ${res.body['id']}    scope=SUITE
    #Set Suite Variable    ${id}
    [Teardown]


Get an existing object
    #[TAGS]
    #...  allure.label.epic:REST_api (Robot Framework)
    #...  allure.label.parentSuite:REST_api (Robot Framework)
    #...  allure.label.suite:REST_api
    #...  allure.label.story:Petstore
    #...  allure.label.package:rest_api.petstore
    #...  allure.label.testMethod:get_existing_pet
    GET        /${id}
    Output     request body
    Output     response body
    Output schema    response body
    Integer    response status    200
    String     response body id    ${id}
    [Teardown]


Delete a pet
    #[TAGS]
    #...  allure.label.epic:REST_api (Robot Framework)
    #...  allure.label.parentSuite:REST_api (Robot Framework)
    #...  allure.label.suite:REST_api
    #...  allure.label.story:Petstore
    #...  allure.label.package:rest_api.petstore
    #...  allure.label.testMethod:delete_pet
    DELETE    /${id}
    Output     request body
    Output     response body
    Output schema    response body
    Integer    response status          200
    #String     response body message    Object with id = ${id} has been deleted.
    [Teardown]


Get an unexisting pet
    #[TAGS]
    #...  allure.label.epic:REST_api (Robot Framework)
    #...  allure.label.parentSuite:REST_api (Robot Framework)
    #...  allure.label.suite:REST_api
    #...  allure.label.story:Petstore
    #...  allure.label.package:rest_api.petstore
    #...  allure.label.testMethod:get_unexisting_pet
    GET        /${id}
    Output     request body
    Output     response body
    Output schema    response body
    Integer    response status        404
    #String     response body error    Object with id=${id} was not found.
    [Teardown]
