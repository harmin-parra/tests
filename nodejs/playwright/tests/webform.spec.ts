import { test } from './base';
import { expect } from '@playwright/test';
import * as allure from "allure-js-commons";
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { WebformPage } from '../pages/webform.page';
import { Junit } from '../support/junit-utils';
import { Attach } from '../support/allure-utils';


// test.use({video: 'on'});


test.beforeEach(async ({ page }) => {
  await page.goto("https://www.selenium.dev/selenium/web/web-form.html");
});


test('Web form', async ({ page }) => {
  await allure.description(
    "Testing the following field types of a webform :\n\n" +
    "- Input text\n" +
    "- Text area\n" +
    "- Select\n" +
    "- Checkbox\n" +
    "- Radio button\n" +
    "- File upload\n" +
    "- Color picker\n" +
    "- Date picker\n" +
    "- Input range\n" +
    "- Button\n"
  );
  await allure.link("https://www.selenium.dev/selenium/web/web-form.html", "Target page");
  await allure.issue("123");
  await allure.tms("https://example.com/TEST-456", "TEST-456");
  await allure.epic("Web interface (Playwright)");
  // await allure.feature("Web Form");
  await allure.story("Web Form");
  await allure.parentSuite("Web interface (Playwright)");
  await allure.suite("Web Form");
  await allure.label(allure.LabelName.PACKAGE, "web_playwright.webform.spec.ts");

  await page.waitForTimeout(1500);
  await allure.attachment("Empty form", await page.screenshot(), { contentType: "image/png" });
  let webform = new WebformPage(page);
  await webform.set_input("login");
  await webform.set_password("password");
  await webform.set_textarea("textarea");
  await webform.set_number(2);
  await webform.set_city("Los Angeles");
  await webform.set_file("../file.xml");
  await webform.set_color("#00ff00");
  await webform.set_date("01/01/2024");
  await webform.set_range(1);
  await page.waitForTimeout(1500);
  await allure.attachment("Complete form", await page.screenshot(), { contentType: "image/png" });
  await allure.attachment("File to upload", fs.readFileSync('../file.xml', 'utf8'), { contentType: "application/xml" });
  await webform.submit();
  await page.waitForTimeout(1500);
  await allure.attachment("Submit form", await page.screenshot(), { contentType: "image/png" });
});


test.afterEach(async ({ page }) => {
  return;
  await page?.context()?.close();
  try {
    const videoPath = await page?.video()?.path();
    const filename = path.basename(videoPath);
    await fsp.copyFile(videoPath, path.join("videos", filename));
    Junit.annotation_video(path.join("videos", filename));
    await Attach.video("Recorded video", videoPath);
  } catch(error) { console.warn("Could not retrieve video"); }
});
