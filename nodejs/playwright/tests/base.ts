import { test as base } from '@playwright/test';
import * as allure from "allure-js-commons";


export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page);
    if (testInfo.status == 'failed' && !page.isClosed()) {
      try {
        await allure.attachment(
          "Last screenshot before failure",
          await page.screenshot(),
          allure.ContentType.PNG
        );
      } catch(error) { }
    }
  },
});
