import { World } from '@cucumber/cucumber';
import Petstore from "./petstore";
import { Catalog, CatalogObject } from './catalog';

class CustomWorld extends World {

  id: string;
  catalogObj: CatalogObject;
  catalog: Catalog;
  //petstore: Petstore;
  payload = null;
  response = null;

  constructor(options: any) {
    super(options)
    this.id = null;
    this.catalog = new Catalog();
    //this.petstore = new Petstore();
    this.payload = null;
    this.response = null;
  }

}

export default CustomWorld;

