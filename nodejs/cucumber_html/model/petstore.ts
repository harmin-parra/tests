import assert from 'assert';
import axios from 'axios';


const url = "https://petstore3.swagger.io/api/v3/pet";

const headers = {
    'Content-Type': 'application/json',
    'accept': 'application/json'
};

class Petstore {

  async get(id: number, world: any) {
    await world.attach(`GET ${url}/${id}`, "text/plain");
    return axios.get(`${url}/${id}`);
  }

  post(payload: string, world: any) {
    world.attach(`POST ${url}`, "text/plain");
    world.attach(JSON.stringify(payload), "application/json");
    return axios.post(url, payload);
  }

  async delete(id: number, world: any) {
    await world.attach(`DELETE ${url}/${id}`, "text/plain");
    return axios.delete(`${url}/${id}`);
  }

}

export default Petstore;
