import { Given, When, Then, World, setWorldConstructor } from '@cucumber/cucumber';
import Petstore from '../model/petstore';
import assert from 'assert';
// import CustomWorld from "../model/customWorld";


class CustomWorld extends World {

  id: number;
  petstore: Petstore;
  payload = null;
  response = null;

  constructor(options: any) {
    super(options)
    this.id = 543;
    this.petstore = new Petstore();
    this.payload = null;
    this.response = null;
  }
}

setWorldConstructor(CustomWorld);


Given("I have a pet store", async function() {
  assert(this.petstore != null);
});


Given('A pet exists in the store', async function() { });


When('I query an existing pet', async function() {
  await this.petstore.get(this.id, this)
    .then(res => {
      assert.equal(res.status, 200);
      this.response = res;
    })
    .catch((err: any) => {
      assert.fail("The pet doesn't exist");
    });
});


Then('I get the pet information', function() {
  this.attach(JSON.stringify(this.response.data), "application/json");
  assert.equal(typeof this.response.data['id'], 'number');
  assert.equal(typeof this.response.data['name'], 'string');
  assert.equal(typeof this.response.data['status'], 'string');
});


When('I add a pet', async function() {
  this.payload = {
    "id": this.id,
    "name": "doggie",
    "status": "available"
  };
  await this.petstore.post(this.payload, this)
    .then(res => {
      this.attach(JSON.stringify(res.data), "application/json");
      assert.equal(res.status, 200);
    })
    .catch(err => {
      assert.fail("The pet was not added");
    });
});


Then('The pet is added', async function() {
  await this.petstore.get(this.id, this)
    .then(res => {
      this.attach(JSON.stringify(res.data), "application/json");
      assert.equal(res.status, 200);
      for( var key in this.payload )
        assert.equal(res.data[key], this.payload[key]);
    })
    .catch(err => {
      assert.fail("The pet was not added");
    });
});


When('I delete a pet', async function() {
  await this.petstore.delete(this.id, this)
    .then(res => {
      this.attach(JSON.stringify(res.data), "application/json");
      assert.equal(res.status, 200);
    })
    .catch(err => {
      assert.fail("The pet was not deleted");
    });
});


Then('The pet is deleted', async function() {
  await this.petstore.get(this.id, this)
    .then(res => {
      this.attach(JSON.stringify(res.data), "application/json");
      assert.fail("The pet was not deleted");
    })
    .catch(err => {
      this.attach(JSON.stringify(err.response.data), "application/json");
    });
});
