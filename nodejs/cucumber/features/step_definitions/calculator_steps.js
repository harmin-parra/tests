const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const Calculator = require('../../model/calculator');


Given("I have a calculator", () => {
  this.calculator = new Calculator();
});


When("I add {int} and {int}", (x, y) => {
  this.sum = this.calculator.add(x, y);
});


Then("The calculator returns {int}", (sum) => {
  /*this.epic("Cucumber");
  this.feature("Calculator");
  this.story("Addition");
  this.parentSuite("Cucumber");
  this.suite("Calculator");*/
  assert.equal(this.sum, sum);
});
