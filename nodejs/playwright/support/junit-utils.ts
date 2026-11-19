import { test, type Page } from '@playwright/test';
import { Attach } from "./allure-utils";
import * as allure from "allure-js-commons";
import { getTestCaseFields } from './testrail-utils';


export async function addTestRailFields(caseid: number | string): Promise<void> {
  let fields: any = await getTestCaseFields(caseid);
  for (const ref of fields.refs)
    await allure.issue(ref);
  await Junit.annotation_issues(fields.refs);
}

export async function logLastScreenshot(page: Page, caseid: number | string = 0) {
  const screenshotPath = await Attach.lastScreenshot(page, caseid);
  if (screenshotPath)
    await Junit.annotation_image(screenshotPath);
}


export class Junit {

  static async annotation_result() {
    test.info().annotations.push({
      type: 'comment',
      description: "Test executed with Playwright"
    });
  }

  static async annotation_case_id(caseid: number | string) {
    test.info().annotations.push({
      type: 'case_id',
      description: caseid.toString()
    });
  }

  static async annotation_image(filePath: string) {
    test.info().annotations.push({
      type: 'image',
      description: filePath
    });
  }

  static async annotation_issues(issues: string[]) {
    if (issues.length > 0) {
      test.info().annotations.push({
        type: 'issues',
        description: issues.join(',')
      });
    }
  }

  static async annotation_video(filePath: string) {
    test.info().annotations.push({
      type: 'video',
      description: filePath
    });
  }

  static async annotation_pdf(filePath: string) {
    test.info().annotations.push({
      type: 'pdf',
      description: filePath
    });
  }

}


function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}
