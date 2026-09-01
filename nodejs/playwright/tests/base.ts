import { test as base, expect, TestInfo, type Locator, type Page } from '@playwright/test';
import { CoverageFixture, DBFixture, dbFixture, PageFixture, pageFixture, SoftAssertFixture, softAssertFixture } from '../support/fixtures';
import { addCoverageReport } from 'monocart-reporter';


export { expect, type Locator, type Page };

export const test = base
  .extend<PageFixture>(pageFixture)
  .extend<SoftAssertFixture>(softAssertFixture)
  .extend<DBFixture>(dbFixture);
  /*
  .extend<CoverageFixture>({
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
  */


/*
// Start coverage
test.beforeEach(async ({ page, browserName }) => {
  if (browserName == "firefox" || browserName == "webkit")
    return;
  await page.coverage.startJSCoverage({ resetOnNavigation: false });
  // await page.coverage.startCSSCoverage({ resetOnNavigation: false });
});


// Add coverage
test.afterEach(async ({ page, browserName }, testInfo: TestInfo) => {
  if (browserName == "firefox" || browserName == "webkit")
    return;
  try {
    const coverage = await page.coverage.stopJSCoverage();
    if (coverage.length > 0)
      await addCoverageReport(coverage, testInfo);
    } catch(error) { }
});
*/

/*
The old chatGPT version

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

*/
