import { test as base, expect } from '@playwright/test';
import { PageFixture, pageFixture, SoftAssertFixture, softAssertFixture } from '../support/fixtures';
import fs from 'node:fs';
import path from 'node:path';
import { COVERAGE_RESULTS_FOLDER } from '../support/shared-variables';
import { Junit } from '../support/junit-utils';
import { Attach } from '../support/allure-utils';


export const test = base
  .extend<PageFixture>(pageFixture)
  .extend<SoftAssertFixture>(softAssertFixture);

export { expect };


// Start coverage
test.beforeEach(async ({ page, browserName }) => {
  if (browserName == "firefox" || browserName == "webkit")
    return;
  await page.coverage.startJSCoverage();
  await page.coverage.startCSSCoverage();
});


// Add video
test.afterEach(async ({ page }) => {
  await page?.context()?.close();
  try {
    const videoPath = await page?.video()?.path();
    Junit.annotation_video(videoPath);
    await Attach.video("Recorded video", videoPath);
  } catch(error) { console.warn("Could not retrieve video"); }
});


// Add coverage
test.afterEach(async ({ page, browserName }) => {
  if (browserName == "firefox" || browserName == "webkit")
    return;

  const jsCoverage = await page.coverage.stopJSCoverage();
  const cssCoverage = await page.coverage.stopCSSCoverage();

  const coverageDir = path.join(COVERAGE_RESULTS_FOLDER);
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
