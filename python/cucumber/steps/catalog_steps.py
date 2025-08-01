from behave import given, when, then
from model import catalog
import allure


# Shared variables between steps
id = None
result = None
payload = None


@given('I have a catalog')
def step_impl(context):
    pass


@when('I add an object')
def step_impl(context):
    global payload, id, result
    payload = {
        "name": "Lenovo notebook",
        "data": {
            "year": 2019,
            "price": 1849.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB"
        }
    }
    result = catalog.post(payload)
    assert result.status_code == 200
    id = result.json()["id"]


@then('The object is added')
def step_impl(context):
    global payload, id, result
    result = catalog.get(id)
    assert result.status_code == 200
    obj = result.json()
    for key in payload:
        assert obj[key] == payload[key]


@given('An object exists in the catalog')
def step_impl(context):
    global payload, id, result
    catalog.get(id)


@when('I query an object')
def step_impl(context):
    global payload, id, result
    res = catalog.get(id)
    result = res


@then('I get the object information')
def step_impl(context):
    global payload, id, result
    assert result.status_code == 200
    assert 'id' in result.json()
    assert 'name' in result.json()
    assert 'data' in result.json()


@when('I delete an object')
def step_impl(context):
    global payload, id, result
    result = catalog.delete(id)
    assert result.status_code == 200
    assert result.json()['message'] == f"Object with id = {id} has been deleted."


@then('The object is deleted')
def step_impl(context):
    global payload, id, result
    result = catalog.get(id)
    assert result.status_code == 404
    assert result.json()['error'] == f"Oject with id={id} was not found."
