import * as allure from "allure-js-commons";
import { type Page } from '@playwright/test';
import { TestCase } from "@playwright/test/reporter";


/**
 * Wrapper that sets Allure labels and adds matching Playwright annotations
 * so custom reporters can access them.
 */
export async function setAllureHierarchy(parentSuite?: string, suite?: string, subSuite?: string) {
  if (parentSuite) {
    await allure.parentSuite(parentSuite);
  }
  if (suite) {
    await allure.suite(suite);
  }
  if (subSuite) {
    await allure.subSuite(subSuite);
  }
}


/**
 * Build a readable test path using Allure suite labels
 * (parentSuite > suite > subSuite > test title)
 */
export function getAllurePath(test: TestCase): string {
  const getLabel = (label: string) =>
    test.annotations.find(a => a.type === `allure.label.${label}`)?.description?.trim();

  const parentSuite = getLabel('parentSuite');
  const suite = getLabel('suite');
  const subSuite = getLabel('subSuite');
  const title = test.title.trim();

  const parts = [parentSuite, suite, subSuite, title].filter(
    (p): p is string => !!p && p.length > 0
  );

  return parts.join(' > ');
}


/**
 * Class to add Allure attachments to test executions.
 */
export class Attach {

  static async image(page: Page, title: string): Promise<void> {
    try {
      await allure.attachment(title, await page.screenshot(), allure.ContentType.PNG);
    } catch(error) { }
  }

  static async text(title: string, content: string): Promise<void> {
    try {
      await allure.attachment(title, content, allure.ContentType.TEXT);
    } catch(error) { }
  }

  static async json(title: string, content: any): Promise<void> {
    try {
      await Attach.text(title, JSON.stringify(content, null, 4));
    } catch(error) { }
  }

  static async lastScreenshot(page: Page, caseid: number | string = 0): Promise<string> {
    try {
      const screenshotPath = `screenshots/C${caseid}.png`;
      const buffer: Buffer = await page.screenshot({ path: screenshotPath });
      await allure.attachment("Last screenshot before failure", buffer, allure.ContentType.PNG);
      return screenshotPath;
    } catch(error) { }
  }
}
