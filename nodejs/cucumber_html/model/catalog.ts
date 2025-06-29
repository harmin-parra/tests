import lodash from 'lodash';
import axios from 'axios';


const url = "https://api.restful-api.dev/objects";

const headers = {
  'Content-Type': 'application/json',
  'accept': 'application/json'
};

class CatalogObject {

  id: string;
  name: string;
  data: object;

  constructor(obj: object) {
    this.id = obj['id'];
    this.name = obj['name'];
    this.data = lodash.cloneDeep(obj['data']);
  }
}

class Catalog {

  async get(id: string, world: any) {
    await world.attach(`GET ${url}/${id}`, "text/plain");
    return await axios.get(`${url}/${id}`);
  }

  async post(payload: object, world: any) {
    world.attach(`POST ${url}`, "text/plain");
    world.attach(JSON.stringify(payload), "application/json");
    return await axios.post(url, payload);
  }

  async delete(id: string, world: any) {
    await world.attach(`DELETE ${url}/${id}`, "text/plain");
    return await axios.delete(`${url}/${id}`);
  }

}

export { Catalog, CatalogObject };
