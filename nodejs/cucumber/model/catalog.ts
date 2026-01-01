import lodash from 'lodash';
import axios from 'axios';
import { World } from '@cucumber/cucumber';


const url = "https://api.restful-api.dev/objects";

const headers = {
  'Content-Type': 'application/json',
  'accept': 'application/json'
};


interface ICatalogItem {
  id: string;
  name: string;
  data: object;
  createdAt?: Date;
  [key: string]: any;
}


export class CatalogItem {

  id: string;
  name: string;
  data: object;
  createdAt: Date;

  constructor(obj: ICatalogItem) {
    this.id = obj['id'];
    this.name = obj['name'];
    this.data = lodash.cloneDeep(obj['data']);
    if ("createdAt" in obj)
      this.createdAt = obj['createdAt'];
  }
}


export class Catalog {

  world: World;

  constructor(world: World = null) {
    this.world = world;
  }

  async get(id: string) {
    if (this.world)
      this.world.attach(`GET ${url}/${id}`, "text/plain");
    return await axios.get(`${url}/${id}`);
  }

  async post(payload: object) {
    if (this.world) {
      this.world.attach(`POST ${url}`, "text/plain");
      this.world.attach("Payload:\n" + JSON.stringify(payload, null, 2));
    }
    return await axios.post(url, payload);
  }

  async delete(id: string) {
    if (this.world)
      this.world.attach(`DELETE ${url}/${id}`, "text/plain");
    return await axios.delete(`${url}/${id}`);
  }

}
