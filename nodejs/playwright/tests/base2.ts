import { test as base, TestInfo } from '@playwright/test';
import { getCaseid } from '../support/utils';
import * as allure from "allure-js-commons";
import { SoftAssert } from '../support/SoftAssert';
import { addCoverageReport } from 'monocart-reporter';
import { addTestRailFields, Junit, logLastScreenshot } from '../support/junit-utils';
import { disposeDBClient, initializeDBClient } from '../db/facade';


type Fixtures = {
  db_pool: void,
  soft_assert: SoftAssert,
  coverage: void,
};


export const test = base.extend<Fixtures>({

  page: async ({ page }, use, testInfo: TestInfo) => {
    await allure.label("env", testInfo.project.name);
    const caseid = getCaseid(testInfo.title);
    if (caseid != '0') {
      await Junit.annotation_case_id(caseid);
      await allure.tms(caseid);
      await addTestRailFields(caseid);
    }
    await use(page);
    if (testInfo.status == 'failed') {
      await logLastScreenshot(page, caseid);
    }
  },

  db_pool: async ({}, use, testInfo: TestInfo) => {
    const env = process.env.ENV;
    await initializeDBClient(env);
    await use();
    await disposeDBClient();
  },

  soft_assert: async ({}, use) => {
    let soft_assert = new SoftAssert();
    await use(soft_assert);
    soft_assert.verifyAll();
  },

  coverage: [
    async ({ page, browserName }, use, testInfo: TestInfo) => {
      if (!(process.env.CI == 'true' && browserName == 'chromium'))
        await use();
      else {
        await page.coverage.startJSCoverage({ resetOnNavigation: false });

        await use();

        try {
          const coverage = await page.coverage.stopJSCoverage();
          if (coverage.length > 0)
            await addCoverageReport(coverage, testInfo);
        } catch(error) { }
      }
    },
    { auto: true },
  ],

});
