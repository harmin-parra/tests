const assert = require('assert');
const axios = require('axios');


headers = {
    'Content-Type': 'application/json',
    'accept': 'application/json'
};

class Petstore {

  get(id, allure) {
    allure.attach("GET https://petstore.swagger.io/v2/pet/" + id, "text/plain");
    return axios.get("https://petstore.swagger.io/v2/pet/" + id);
  }

  post(payload, allure) {
    allure.attach("POST https://petstore.swagger.io/v2/pet/", "text/plain");
    allure.attach(JSON.stringify(payload), "application/json");
    return axios.post("https://petstore.swagger.io/v2/pet/", payload);
  }

  delete(id, allure) {
    allure.attach("DELETE https://petstore.swagger.io/v2/pet/" + id, "text/plain");
    return axios.delete("https://petstore.swagger.io/v2/pet/" + id);
  }

}

module.exports = Petstore;
