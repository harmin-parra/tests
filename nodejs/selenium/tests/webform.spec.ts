import { By, until, WebDriver } from "selenium-webdriver";
import assert from "node:assert";
import * as allure from "allure-js-commons";
import { ContentType } from "allure-js-commons";
import { getWebDriver, getScreenshot } from "../support/webdriver";
import { WebFormPage } from "../pages/webform.page"; 


describe("Webform Test", function () {
  let driver: WebDriver;

  before(async () => {
    driver = await getWebDriver();
    await driver.get("https://www.selenium.dev/selenium/web/web-form.html");
  });

  after(async () => {
    await driver.quit();
  });


  it("Web form", async () => {
    await allure.description(`
      Testing the following field types of a webform :

      - Input text
      - Text area
      - Select
      - Checkbox
      - Radio button
      - File upload
      - Color picker
      - Date picker
      - Input range
      - Button
    `);
    await allure.parentSuite("Web interface (Selenium)");
    await allure.suite("Web Form");
    await allure.tms("https://tms.example.com/TEST-456", "TEST-456");
    await allure.issue("https://issues.example.com/JIRA-777", "JIRA-123");
    await allure.link("https://www.selenium.dev/selenium/web/web-form.html", "Target page");

    let page: WebFormPage = await new WebFormPage(driver).init();
    await allure.attachment("Empty form", await getScreenshot(driver), ContentType.PNG);
    await page.setInput("Hello");
    await page.setPassword("secret");
    await page.setTextarea("Some long text");
    await page.setNumber(2);
    await page.setCity("New York");
    await page.setFile("//tmp/file.xml");
    await page.setColor("#ff0000");
    await page.setDate("2023-01-01");
    await page.setRange(1);
    await allure.attachment("Complete form", await getScreenshot(driver), ContentType.PNG);
    await allure.attachmentPath("File to upload", "/tmp/file.xml", { contentType: ContentType.XML });
    await page.submit();
    await allure.attachment("Submit form", await getScreenshot(driver), ContentType.PNG);
  });

});
