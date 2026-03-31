import { test as base, expect } from '@playwright/test';
import { MainFixture, mainFixture, SoftAssertFixture, softAssertFixture } from '../support/fixtures';
import fs from 'node:fs';
import path from 'node:path';
import { COVERAGE_RESULTS_FOLDER } from '../support/shared-variables';


export const test = base
  .extend<MainFixture>(mainFixture)
  .extend<SoftAssertFixture>(softAssertFixture);

export { expect };


test.beforeEach(async ({ page, browserName }) => {
  if (browserName == "firefox" || browserName == "webkit")
    return;
  await page.coverage.startJSCoverage();
  await page.coverage.startCSSCoverage();
});


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
