import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import lodash from 'lodash';
import { CatalogItem } from '../model/catalog';
import { api_context } from '../support/api_context';
import { CustomWorld } from '../support/world';


Given("I have a catalog", function(this: CustomWorld) {
  assert(this.api != null);
});


Given('An object exists in the catalog', function(this: CustomWorld) {
  assert(api_context.id != null);
});


When('I query an existing object', async function(this: CustomWorld) {
  assert(api_context.id != null, "No object has been added to the catalog");
  await this.api.get(api_context.id)
    .then((response: any) => {
      assert.equal(response.status, 200);
      assert.equal(api_context.id, response.data.id, "Id's mismatch");
      api_context.response = response;
      api_context.id = response.data.id;
    })
    .catch(() => {
      assert.fail("The object doesn't exist");
    });
});


Then('I get the object information', function(this: CustomWorld) {
  this.attach("Status code: " + api_context.response.status);
  this.attach("Response:\n" + JSON.stringify(api_context.response.data, null, 2));
  assert.equal(typeof api_context.response.data['id'], 'string');
  assert.equal(typeof api_context.response.data['name'], 'string');
  assert.equal(typeof api_context.response.data['data'], 'object');
});


When('I add an object', async function(this: CustomWorld) {
  api_context.payload = {
    "name": "Lenovo notebook",
    "data": {
      "year": 2019,
      "price": 1849.99,
      "CPU model": "Intel Core i9",
      "Hard disk size": "1 TB"
    }
  };
  await this.api.post(api_context.payload)
    .then(response => {
      this.attach("Status code: " + response.status);
      this.attach("Response:\n" + JSON.stringify(response.data, null, 2));
      assert.equal(response.status, 200);
      api_context.id = response.data.id;
      api_context.item = new CatalogItem(response.data);
      assert.equal(api_context.payload.name, api_context.item.name);
      assert(lodash.isEqual(api_context.payload.data, api_context.item.data));
    })
    .catch(error => {
      this.attach("Status code: " + error.status);
      this.attach("Response:\n" + JSON.stringify(error.response.data));
      assert.fail("The object was not added");
    });
});


Then('The object is added', async function(this: CustomWorld) {
  await this.api.get(api_context.id)
    .then(response => {
      this.attach("Status code: " + response.status);
      this.attach("Response:\n" + JSON.stringify(response.data, null, 2));
      assert.equal(response.status, 200, "status != 200");
      assert.equal(response.data.id, api_context.item.id);
      assert.equal(response.data.name, api_context.item.name);
      assert(lodash.isEqual(response.data.data, api_context.item.data));
    })
    .catch(error => {
      this.attach("Status code: " + error.status);
      this.attach("Response:\n" + JSON.stringify(error.response.data));
      assert.fail("The object was not added");
    });
});


When('I delete an object', async function(this: CustomWorld) {
  await this.api.delete(api_context.id)
    .then(response => {
      this.attach("Status code: " + response.status);
      this.attach("Response:\n" + JSON.stringify(response.data, null, 2));
      assert.equal(response.status, 200);
      assert.equal(response.data.message, `Object with id = ${api_context.id} has been deleted.`);
    })
    .catch(error => {
      this.attach("Status code: " + error.status);
      this.attach("Response:\n" + JSON.stringify(error.response.data, null, 2));
      assert.fail("The object was not deleted");
    });
});


Then('The object is deleted', async function(this: CustomWorld) {
  await this.api.get(api_context.id)
    .then(response => {
      this.attach("Status code: " + response.status);
      this.attach("Response:\n" + JSON.stringify(response.data, null, 2));
      assert.fail("The object was not deleted");
    })
    .catch(error => {
      this.attach("Status code: " + error.status);
      this.attach("Response:\n" + JSON.stringify(error.response.data, null, 2));
      assert.equal(error.response.data.error, `Oject with id=${api_context.id} was not found.`)
    });
});
