import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import assert from 'assert';
import lodash from 'lodash';
import { CatalogItem } from '../model/catalog';
import { context } from '../model/context';


setDefaultTimeout(50 * 1000);


Given("I have a catalog", function() {
  assert(context.catalog != null);
});


Given('An object exists in the catalog', function() {
  assert(context.id != null);
});


When('I query an existing object', async function() {
  await context.catalog.get(context.id, this)
    .then(response => {
      assert.equal(response.status, 200);
      context.response = response;
    })
    .catch(error => {
      assert.fail("The object doesn't exist");
    });
});


Then('I get the object information', function() {
  this.attach("Status code: " + context.response.status);
  this.attach("Response:\n" + JSON.stringify(context.response.data, null, 2));
  assert.equal(typeof context.response.data['id'], 'string');
  assert.equal(typeof context.response.data['name'], 'string');
  assert.equal(typeof context.response.data['data'], 'object');
});


When('I add an object', async function() {
  await context.catalog.post(context.payload, this)
    .then(response => {
      this.attach("Status code: " + response.status);
      this.attach("Response:\n" + JSON.stringify(response.data, null, 2));
      assert.equal(response.status, 200);
      context.id = response.data.id;
      context.item = new CatalogItem(response.data);
      assert.equal(context.payload.name, context.item.name);
      assert(lodash.isEqual(context.payload.data, context.item.data));
    })
    .catch(error => {
      this.attach("Status code: " + error.status);
      this.attach("Response:\n" + JSON.stringify(error.response.data));
      assert.fail("The object was not added");
    });
});


Then('The object is added', async function() {
  await context.catalog.get(context.id, this)
    .then(response => {
      this.attach("Status code: " + response.status);
      this.attach("Response:\n" + JSON.stringify(response.data, null, 2));
      assert.equal(response.status, 200, "status != 200");
      assert.equal(response.data.id, context.item.id);
      assert.equal(response.data.name, context.item.name);
      assert(lodash.isEqual(response.data.data, context.item.data));
    })
    .catch(error => {
      this.attach("Status code: " + error.status);
      this.attach("Response:\n" + JSON.stringify(error.response.data));
      assert.fail("The object was not added");
    });
});


When('I delete an object', async function() {
  await context.catalog.delete(context.id, this)
    .then(response => {
      this.attach("Status code: " + response.status);
      this.attach("Response:\n" + JSON.stringify(response.data, null, 2));
      assert.equal(response.status, 200);
      assert.equal(response.data.message, `Object with id = ${context.id} has been deleted.`);
    })
    .catch(error => {
      this.attach("Status code: " + error.status);
      this.attach("Response:\n" + JSON.stringify(error.response.data, null, 2));
      assert.fail("The object was not deleted");
    });
});


Then('The object is deleted', async function() {
  await context.catalog.get(context.id, this)
    .then(response => {
      this.attach("Status code: " + response.status);
      this.attach("Response:\n" + JSON.stringify(response.data, null, 2));
      assert.fail("The object was not deleted");
    })
    .catch(error => {
      this.attach("Status code: " + error.status);
      this.attach("Response:\n" + JSON.stringify(error.response.data, null, 2));
      assert.equal(error.response.data.error, `Oject with id=${context.id} was not found.`)
    });
});
