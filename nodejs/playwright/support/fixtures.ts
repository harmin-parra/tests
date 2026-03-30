import type { Page, TestInfo } from '@playwright/test';
import * as allure from "allure-js-commons";
import { Junit } from './junit-utils';
import { addJiraReferences, logLastScreenshot } from './utils';
import { SoftAssert } from './SoftAssert';


const regex = /-\s*C(\d+)$/;

export type MainFixture = {
  page: Page
};

export type SoftAssertFixture = {
  soft_assert: SoftAssert
}


export const mainFixture = {
    page: async ({ page }: { page: Page}, use: (arg: Page) => Promise<void>, testInfo: TestInfo) => {
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
}


export const softAssertFixture = {
  soft_assert: async ({}, use: (arg: SoftAssert) => Promise<void>) => {
    let soft_assert = new SoftAssert();
    await use(soft_assert);
    soft_assert.verifyAll();
  },
}
