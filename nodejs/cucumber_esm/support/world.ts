import { World } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from 'playwright';


export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
}
