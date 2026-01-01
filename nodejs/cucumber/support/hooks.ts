import { Before, After, setDefaultTimeout, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { type Browser } from 'playwright';
import { setWorldConstructor } from '@cucumber/cucumber';
import { CustomWorld, UiContext } from './world';
import { Catalog } from '../model/catalog';
import fs from 'node:fs';


setWorldConstructor(CustomWorld);
setDefaultTimeout(60 * 1000);

let sharedBrowser: Browser = null;


BeforeAll(async function () {
  // sharedBrowser = await chromium.launch();
});


Before({ tags: '@ui' }, async function (this: CustomWorld) {
  this.ui = await UiContext.create(null);
});


Before({ tags: '@api' }, async function (this: CustomWorld) {
  this.api = new Catalog(this);
});


After({ tags: '@ui' }, async function (this: CustomWorld) {
  await this.ui?.page?.context()?.close();
  const videoPath = await this.ui?.page?.video()?.path();
  if (videoPath)
    this.attach(fs.readFileSync(videoPath), "video/webm");
  await this.ui?.page?.close();
  await this.ui?.dispose();
  this.ui = null;
});


AfterAll(async () => {
  // if (sharedBrowser)
  //   await sharedBrowser.close();
})
