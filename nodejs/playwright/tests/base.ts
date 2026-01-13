import { test as base } from '@playwright/test';
import * as allure from "allure-js-commons";
import { Junit } from '../support/junit-utils';
import { addJiraReferences, logLastScreenshot } from '../support/utils';


const regex = /-\s*C(\d+)$/;


export const test = base.extend({
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
