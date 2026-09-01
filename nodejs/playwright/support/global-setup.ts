import { storagePath } from './shared-variables';
import { chromium, firefox, expect, FullConfig } from '@playwright/test';
import { init_date } from './constants';


export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use?.baseURL;
  await storeSession(baseURL);
  init_date();
}


async function storeSession(baseURL: string) {
  console.log("Creating and saving shared manager session");
  const browser = await firefox.launch();
  const page = await browser.newPage();
  await page.goto(baseURL + '/login', { timeout: 60_000 });
  // do the login
  await expect(page).toHaveURL(/\/home*/, { timeout: 60_000 });
  // Save session/localStorage to a file
  await page.context().storageState({ path: storagePath });

  await page.close();
  await browser.close();
}
