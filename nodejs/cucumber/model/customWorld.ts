import { World } from '@cucumber/cucumber';
import { Catalog, CatalogItem } from './catalog';

class CustomWorld extends World {

  id: string;
  item: CatalogItem;
  catalog: Catalog;
  payload = null;
  response = null;

  constructor(options: any) {
    super(options)
    this.id = "";
    this.catalog = new Catalog();
    this.payload = null;
    this.response = null;
  }

}

export default CustomWorld;
