const assert = require('assert');
const { Given, When, Then, setWorldConstructor } = require('@cucumber/cucumber');
const { CucumberAllureWorld } = require("allure-cucumberjs")
const { LabelName } = require("allure-js-commons");
const axios = require('axios');
const Petstore = require('../../model/petstore');

setWorldConstructor(CucumberAllureWorld)

var id = 543;
var petstore = new Petstore();


Given("I have a pet store", async function() { 
  assert(petstore != null);
});


Given('A pet exists in the store', async function() { });


When('I query an existing pet', async function() {
  await petstore.get(id, this)
    .then(res => {
      assert.equal(res.status, 200);
      this.response = res;
    })
    .catch(err => {
      assert.fail("The pet doesn't exist");
    });
});


Then('I get the pet information', function() {
  this.description("Find a pet in the store inventory");
  this.link("https://petstore.swagger.io/", "REST API specification");
  this.issue("https://example.com/JIRA-123", "JIRA-123");
  this.tms("https://example.com/TEST-456", "TEST-456");
  this.epic("REST api");
  //this.feature("Petstore");
  //this.story("Get pet info");
  this.parentSuite("REST api");
  //this.suite("Petstore");
  this.label(LabelName.PACKAGE, "cucumber.features.petstore");
  this.attach(JSON.stringify(this.response.data), "application/json");
  assert.equal(typeof this.response.data['id'], 'number');
  assert.equal(typeof this.response.data['name'], 'string');
  assert.equal(typeof this.response.data['status'], 'string');
});


When('I add a pet', async function() {
  payload = {
    "id": id,
    "name": "doggie",
    "status": "available"
  };
  this.payload = payload;
  await petstore.post(payload, this)
    .then(res => {
      this.attach(JSON.stringify(res.data), "application/json");
      assert.equal(res.status, 200);
    })
    .catch(err => {
      this.attach(err.toString(), "text/plain");
      assert.fail("The pet was not added");
    });
});


Then('The pet is added', async function() {
  this.description("Add a new pet in the store inventory");
  this.link("https://petstore.swagger.io/", "REST API specification");
  this.issue("https://example.com/JIRA-123", "JIRA-123");
  this.tms("https://example.com/TEST-456", "TEST-456");
  this.epic("REST api");
  //this.feature("Petstore");
  //this.story("Add pet");
  this.parentSuite("REST api");
  //this.suite("Petstore");
  this.label(LabelName.PACKAGE, "cucumber.features.petstore")
  await petstore.get(id, this)
    .then(res => {
      this.attach(JSON.stringify(res.data), "application/json");
      assert.equal(res.status, 200);
      for( var key in this.payload )
        assert.equal(res.data[key], this.payload[key]);
    })
    .catch(err => {
      this.attach(err.toString(), "text/plain");
      assert.fail("The pet was not added");
    });
});


When('I delete a pet', async function() {
  await petstore.delete(id, this)
    .then(res => {
      this.attach(JSON.stringify(res.data), "application/json");
      assert.equal(res.status, 200);
    })
    .catch(err => {
      this.attach(err.toString(), "text/plain");
      assert.fail("The pet was not deleted");
    });
});


Then('The pet is deleted', async function() {
  this.description("Delete a pet from the store inventory");
  this.link("https://petstore.swagger.io/", "REST API specification");
  this.issue("https://example.com/JIRA-123", "JIRA-123");
  this.tms("https://example.com/TEST-456", "TEST-456");
  this.epic("REST api");
  //this.feature("Petstore");
  //this.story("Delete pet");
  this.parentSuite("REST api");
  //this.suite("Petstore");
  this.label(LabelName.PACKAGE, "cucumber.features.petstore")
  await petstore.get(id, this)
    .then(res => {
      this.attach(JSON.stringify(res.data), "application/json");
      assert.fail("The pet was not deleted");
    })
    .catch(err => {
      this.attach(JSON.stringify(err.response.data), "application/json");
    });
});
