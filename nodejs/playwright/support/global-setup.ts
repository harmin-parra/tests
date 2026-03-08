import fs from 'node:fs';
import path from 'node:path';
import { generateDateLabel } from './date-utils';
import { DATE_FILE, COUNTER_FILE, storagePath } from './shared-variables';
import { chromium, firefox, expect, FullConfig } from '@playwright/test';


export default async function globalSetup(config: FullConfig) {
  fs.writeFileSync(DATE_FILE, generateDateLabel());
  fs.writeFileSync(COUNTER_FILE, '0');
  const baseURL = config.projects[0].use?.baseURL;
  await storeManagerSession(baseURL);
}


async function storeManagerSession(baseURL: string) {
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
