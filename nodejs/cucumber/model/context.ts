import { Catalog, CatalogItem } from './catalog';

export const context = {
  catalog: new Catalog(),
  id: null as string,
  item: null as CatalogItem,
  payload: {
    "name": "Lenovo notebook",
    "data": {
      "year": 2019,
      "price": 1849.99,
      "CPU model": "Intel Core i9",
      "Hard disk size": "1 TB"
    }
  },
  response: null as any
};
