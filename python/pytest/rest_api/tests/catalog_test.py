import pytest
from pytest_bdd import scenarios, given, when, then, parsers
from rest_api.model import catalog


scenarios('../features/catalog.feature')


# Shared variables between scenarios
@pytest.fixture(scope="module")
def context():
    return {
        "id": None,
        "result": None,
        "payload": None
    }


@given('I have a catalog')
def step_impl(context):
    pass


@when('I add an object')
def step_impl(context, report):
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
    context['id'] = result.json()["id"]
    context['result'] = result
    context['payload'] = payload
    report.attach(f"Query: ADD")
    report.attach("Payload:", body=payload, mime=report.Mime.JSON)
    report.attach("Response:", body=result.json(), mime=report.Mime.JSON)


@then('The object is added')
def step_impl(context, report):
    id = context['id']
    payload = context['payload']
    result = catalog.get(id)
    assert result.status_code == 200
    obj = result.json()
    for key in payload:
        assert obj[key] == payload[key]
    context['result'] = result
    report.attach(f"Query: GET /{id}")
    report.attach("Response:", body=result.json(), mime=report.Mime.JSON)


@given('An object exists in the catalog')
def step_impl(context, report):
    id = context['id']
    catalog.get(id)


@when('I query an object')
def step_impl(context, report):
    id = context['id']
    result = catalog.get(id)
    context['result'] = result
    report.attach(f"Query: GET /{id}")
    report.attach("Response:", body=result.json(), mime=report.Mime.JSON)


@then('I get the object information')
def step_impl(context):
    result = context['result']
    assert result.status_code == 200
    assert 'id' in result.json()
    assert 'name' in result.json()
    assert 'data' in result.json()


@when('I delete an object')
def step_impl(context, report):
    id = context['id']
    result = catalog.delete(id)
    assert result.status_code == 200
    assert result.json()['message'] == f"Object with id = {id} has been deleted."
    context['result'] = result
    report.attach(f"Query: DELETE /{id}")
    report.attach("Response:", body=result.json(), mime=report.Mime.JSON)


@then('The object is deleted')
def step_impl(context, report):
    id = context['id']
    result = catalog.get(id)
    assert result.status_code == 404
    assert result.json()['error'] == f"Oject with id={id} was not found."
    context['result'] = result
    report.attach(f"Query: GET /{id}")
    report.attach("Response:", body=result.json(), mime=report.Mime.JSON)
