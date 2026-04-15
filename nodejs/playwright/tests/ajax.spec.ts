import { test } from './base';
import { expect } from '@playwright/test';
import * as allure from "allure-js-commons";
import { AjaxPage } from '../pages/ajax.page';
import assert from 'node:assert';


test.use({video: 'on'});

//test.describe('Ajax tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("http://qa-demo.gitlab.io/reports/web/ajax.html");
  });


  test('Ajax verification with intercept', async ({ page }) => {
    await allure.description("Testing an AJAX page\n\nTest using ``page.waitForResponse()``");
    await allure.link("http://qa-demo.gitlab.io/reports/web/ajax.html", "Target page");
    await allure.issue("123");
    await allure.tms("456");
    await allure.epic("Web interface (Playwright)");
    //await allure.feature("Ajax");
    await allure.story("Ajax");
    await allure.parentSuite("Web interface (Playwright)");
    await allure.suite("Ajax");
    await allure.label(allure.LabelName.PACKAGE, "web_playwright.ajax.spec.ts");

    await allure.attachment("Initial page", await page.screenshot(), { contentType: "image/png" });
    var ajax = new AjaxPage(page);
    // If we want to mock the AJAX response
    //await page.route('**/ajax.txt', async route => {
    //  const txt = "<h1 id='title'>MOCK</h1>";
    //  await route.fulfill({ body: txt });
    //});
    const responsePromise = ajax.page.waitForResponse('**/ajax.txt');
    await ajax.click();
    const response = await responsePromise;
    assert.equal(response.status(), 200);
    await allure.attachment("Trigger event", await page.screenshot(), { contentType: "image/png" });
    await ajax.verify_title();
    await allure.attachment("Verify event result", await page.screenshot(), { contentType: "image/png" });
  });


  test('Ajax verification with expect', async ({ page }) => {
    await allure.description("Testing an AJAX page\n\nTest using ``expect().toBeVisible()``");
    await allure.link("http://qa-demo.gitlab.io/reports/web/ajax.html", "Target page");
    await allure.issue("123");
    await allure.tms("456");
    await allure.epic("Web interface (Playwright)");
    //await allure.feature("Ajax");
    await allure.story("Ajax");
    await allure.parentSuite("Web interface (Playwright)");
    await allure.suite("Ajax");
    await allure.label(allure.LabelName.PACKAGE, "web_playwright.ajax.spec.ts");

    await allure.attachment("Initial page", await page.screenshot(), { contentType: "image/png" });
    let ajax = new AjaxPage(page);
    await ajax.click();
    await allure.attachment("Trigger event", await page.screenshot(), { contentType: "image/png" });
    await ajax.wait_event();
    await ajax.verify_title();
    await allure.attachment("Verify event result", await page.screenshot(), { contentType: "image/png" });
  });

  test.afterEach(async ({ page }) => {
    return;
    await page?.context()?.close();
    const videoPath = await page?.video()?.path();
    if (videoPath)
      await allure.attachmentPath("Recorded video", videoPath, allure.ContentType.WEBM);
  });

//});
