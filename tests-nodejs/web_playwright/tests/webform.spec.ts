import { test, expect, Page } from '@playwright/test';
const fs = require('node:fs');
import * as allure from "allure-js-commons";

import WebformPage from '../pages/webform.page';


//test.describe('Web Form', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.selenium.dev/selenium/web/web-form.html");
  });


  test('Fill in form', async ({ page }) => {
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
    await allure.link("https://www.selenium.dev/selenium/web/web-form.html", "Target webform");
    await allure.issue("JIRA-123", "https://example.com/JIRA-123");
    await allure.tms("TEST-456", "https://example.com/TEST-456");
    await allure.epic("Web interface (Playwright)");
    //await allure.feature("Web Form");
    await allure.story("Web Form");
    await allure.parentSuite("Web interface (Playwright)");
    await allure.suite("Web Form");
    await allure.label(allure.LabelName.PACKAGE, "web_playwright.webform.spec.ts");

    await allure.attachment("Empty form", await page.screenshot(), { contentType: "image/png" });
    var webform = new WebformPage(page);
    await webform.set_input("login");
    await webform.set_password("password");
    await webform.set_textarea("textarea");
    await webform.set_number(2);
    await webform.set_city("Los Angeles");
    await webform.set_file("file.xml");
    await webform.set_color("#00ff00");
    await webform.set_date("01/01/2024");
    await webform.set_range(1);
    await allure.attachment("Complete form", await page.screenshot(), { contentType: "image/png" });
    await allure.attachment("File to upload", fs.readFileSync('file.xml', 'utf8'), { contentType: "application/xml" });
    await webform.submit();
    await allure.attachment("Submit form", await page.screenshot(), { contentType: "image/png" });
  });

//});
