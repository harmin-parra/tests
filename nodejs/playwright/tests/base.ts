import { test as base } from '@playwright/test';
import * as allure from "allure-js-commons";
import { Junit } from '../support/junit-utils';
import { addJiraReferences, logLastScreenshot } from '../support/utils';
import { SoftAssert } from '../support/SoftAssert';


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
