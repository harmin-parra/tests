from behave import given, when, then
from model.calculator import Calculator


@given('I have a calculator')
def step_impl(context):
    context.calculator = Calculator()


@when('I add "{x:d}" and "{y:d}"')
def step_impl(context, x, y):
    assert isinstance(x, int)
    assert isinstance(y, int)
    context.calculator.add(x, y)


@then('the calculator returns "{result:d}"')
def step_impl(context, result):
    assert isinstance(result, int)
    assert context.calculator.result == result
