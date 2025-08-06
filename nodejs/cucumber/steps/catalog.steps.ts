import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import assert from 'assert';
import lodash from 'lodash';
import { Catalog, CatalogItem } from '../model/catalog';


setDefaultTimeout(50 * 1000);

// Global variables shared between scenarios
let id: string;
let catalog: Catalog = new Catalog();
let item: CatalogItem;
let payload = {
  "name": "Lenovo notebook",
  "data": {
    "year": 2019,
    "price": 1849.99,
    "CPU model": "Intel Core i9",
    "Hard disk size": "1 TB"
  }
};
let response: any = null;

Given("I have a catalog", function() {
  assert(catalog != null);
});


Given('An object exists in the catalog', function() {
  assert(id != null);
});


When('I query an existing object', async function() {
  await catalog.get(id, this)
    .then(res => {
      assert.equal(res.status, 200);
      response = res;
    })
    .catch(err => {
      assert.fail("The object doesn't exist");
    });
});


Then('I get the object information', function() {
  this.attach("Response:\n" + JSON.stringify(response.data, null, 2));  //, "application/json");
  this.attach("Status code: " + response.status);
  assert.equal(typeof response.data['id'], 'string');
  assert.equal(typeof response.data['name'], 'string');
  assert.equal(typeof response.data['data'], 'object');
});


When('I add an object', async function() {
  await catalog.post(payload, this)
    .then(res => {
      this.attach("Response:\n" + JSON.stringify(res.data));  //, "application/json");
      assert.equal(res.status, 200);
      id = res.data.id;
      item = new CatalogItem(res.data);
      assert.equal(payload.name, item.name, "name");
      assert(lodash.isEqual(payload.data, item.data));
    })
    .catch(err => {
      this.attach("Response:\n" + JSON.stringify(err.response.data));  //, "application/json");
      assert.fail("The object was not added");
    });
});


Then('The object is added', async function() {
  await catalog.get(id, this)
    .then(res => {
      this.attach("Response:\n" + JSON.stringify(res.data));  //, "application/json");
      assert.equal(res.status, 200, "status != 200");
      assert.equal(res.data.id, item.id, "id");
      assert.equal(res.data.name, item.name, "name");
      assert(lodash.isEqual(res.data.data, item.data));
    })
    .catch(err => {
      this.attach("Response:\n" + JSON.stringify(err.response.data));  //, "application/json");
      assert.fail("The object was not added");
    });
});


When('I delete an object', async function() {
  await catalog.delete(id, this)
    .then(res => {
      this.attach(JSON.stringify(res.data), "application/json");
      assert.equal(res.status, 200);
      assert.equal(res.data.message, `Object with id = ${id} has been deleted.`);
    })
    .catch(err => {
      this.attach(JSON.stringify(err.response.data), "application/json");
      assert.fail("The object was not deleted");
    });
});


Then('The object is deleted', async function() {
  await catalog.get(id, this)
    .then(res => {
      this.attach("Response:\n" + JSON.stringify(res.data));  //, "application/json");
      assert.fail("The object was not deleted");
    })
    .catch(err => {
      this.attach("Response:\n" + JSON.stringify(err.response.data));  //, "application/json");
      assert.equal(err.response.data.error, `Oject with id=${id} was not found.`)
    });
});
