import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import { setWorldConstructor } from '@cucumber/cucumber';
import { CustomWorld } from './world.js';


setWorldConstructor(CustomWorld);
setDefaultTimeout(60 * 1000);

/*
Before(async function () {
  this.browser = await chromium.launch();
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  await this.page.close();
  await this.context.close();
  await this.browser.close();
});
*/
