package steps;

import calculator.Calculator;
import io.cucumber.java.en.*;
import static org.junit.jupiter.api.Assertions.*;

public class CalculatorSteps {

    private Calculator calculator;
    private int result;

    @Given("a calculator")
    public void a_calculator() {
        calculator = new Calculator();
    }

    @When("I add {int} and {int}")
    public void i_add_and(int a, int b) {
        result = calculator.add(a, b);
    }

    @Then("the result should be {int}")
    public void the_result_should_be(int expected) {
        assertEquals(expected, result);
    }
}
