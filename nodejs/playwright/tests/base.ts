import { test as base } from '@playwright/test';
import * as allure from "allure-js-commons";
import { Junit } from '../support/junit-utils';
import { addJiraReferences, logLastScreenshot } from '../support/utils';
import { SoftAssert } from '../support/SoftAssert';
import path from 'node:path';
import fs from 'node:fs';
import { COVERAGE_RAW_FOLDER } from '../support/shared-variables';


const regex = /-\s*C(\d+)$/;


type Fixtures = {
  soft_assert: SoftAssert,
};


export const test = base.extend<Fixtures>({
  soft_assert: async ({}, use) => {
    let soft_assert = new SoftAssert();
    await use(soft_assert);
    soft_assert.verifyAll();
  },

  page: async ({ page }, use, testInfo) => {
    const match = testInfo.title.match(regex);
    const caseid: string = match ? match[1] : '0';
    await allure.label("env", testInfo.project.name);
    if (caseid != '0') {
      await Junit.annotation_case_id(caseid);
      await allure.tms(caseid);
      await addJiraReferences(caseid);
    }
    await use(page);
    if (testInfo.status == 'failed' && !page.isClosed()) {
      await logLastScreenshot(page, caseid);
    }
  },
});


test.beforeEach(async ({ page }) => {
  if (process.env.BROWSER == "firefox" ||  process.env.BROWSER == "webkit")
    return;
  await page.coverage.startJSCoverage();
  await page.coverage.startCSSCoverage();
});


test.afterEach(async ({ page }) => {
  if (process.env.BROWSER == "firefox" ||  process.env.BROWSER == "webkit")
    return;

  const jsCoverage = await page.coverage.stopJSCoverage();
  const cssCoverage = await page.coverage.stopCSSCoverage();

  const coverageDir = path.join(COVERAGE_RAW_FOLDER);
  if (!fs.existsSync(coverageDir)) {
    fs.mkdirSync(coverageDir, { recursive: true });
  }

  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  fs.writeFileSync(
    path.join(coverageDir, `js-${stamp}.json`),
    JSON.stringify(jsCoverage, null, 2)
  );

  fs.writeFileSync(
    path.join(coverageDir, `css-${stamp}.json`),
    JSON.stringify(cssCoverage, null, 2)
  );
});
