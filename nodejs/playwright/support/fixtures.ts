import type { Page, TestInfo } from '@playwright/test';
import * as allure from "allure-js-commons";
import { Junit } from './junit-utils';
import { addJiraReferences, logLastScreenshot } from './utils';
import { SoftAssert } from './SoftAssert';
import path from 'node:path';
import fsp from 'node:fs/promises';
import { Attach } from './allure-utils';


const regex = /-\s*C(\d+)$/;

export type PageFixture = {
  page: Page
};

export type SoftAssertFixture = {
  soft_assert: SoftAssert
}


export const pageFixture = {
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

    // Last screnshots if failure
    if (testInfo.status == 'failed' && !page.isClosed()) {
      await logLastScreenshot(page, caseid);
    }

    // Process video
    await page?.context()?.close();
    try {
      const videoPath = await page?.video()?.path();
      const filename = path.basename(videoPath);
      await fsp.copyFile(videoPath, path.join("videos", filename));
      Junit.annotation_video(path.join("videos", filename));
      await Attach.video("Recorded video", videoPath);
    } catch(error) { console.warn("Could not retrieve video"); }
  },
}


export const softAssertFixture = {
  soft_assert: async ({}, use: (arg: SoftAssert) => Promise<void>) => {
    let soft_assert = new SoftAssert();
    await use(soft_assert);
    soft_assert.verifyAll();
  },
}
