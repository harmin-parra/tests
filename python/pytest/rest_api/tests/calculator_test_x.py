import pytest
from pytest_bdd import scenarios, given, when, then, parsers
from rest_api.model.calculator import add


# Load the feature file
scenarios('../features/calculator.feature')


# Context fixture to share data between steps
@pytest.fixture
def context():
    return {}


@given(parsers.parse("the first number is {a:d}"))
def first_number(a, context, report):
    context["a"] = a
    report.attach(f"First number: {a}")


@given(parsers.parse("the second number is {b:d}"))
def second_number(b, context, report):
    context["b"] = b
    report.attach(f"Second number: {b}")


@when("the numbers are added")
def add_numbers(context, report):
    context["result"] = add(context["a"], context["b"])
    report.attach(f"The addition: {context['result']}")


@then(parsers.parse("the result should be {result:d}"))
def check_result(context, result):
    assert context["result"] == result


@given("I am on the login page")
def login_page(report):
    report.attach(f"Will attempt login")


@when("I enter valid credentials")
def enter_credentials():
    pass


@then("I should be redirected to the dashboard")
def redirected():
    pass
