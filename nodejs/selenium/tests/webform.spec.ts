import { By, until, WebDriver } from "selenium-webdriver";
import assert from "node:assert";
import * as allure from "allure-js-commons";
import { ContentType } from "allure-js-commons";
import { getWebDriver } from "../support/webdriver";
import { WebFormPage } from "../pages/webform.page"; 


describe("Webform Test", function () {
  let driver: WebDriver;

  before(async () => {
    driver = await getWebDriver();
  });

  after(async () => {
    await driver.quit();
  });


  it("Fill in form", async () => {
    await driver.get("https://www.selenium.dev/selenium/web/web-form.html");
    let page: WebFormPage = await new WebFormPage(driver).init();
    await allure.attachment("Empty form", Buffer.from(await driver.takeScreenshot(), "base64"), ContentType.PNG);
    await page.setInput("Hello");
    await page.setPassword("secret");
    await page.setTextarea("Some long text");
    await page.setNumber(2);
    await page.setCity("New York");
    await page.setFile("//tmp/file.xml");
    await page.setColor("#ff0000");
    await page.setDate("2023-01-01");
    await page.setRange(1);
    await allure.attachment("Complete form", Buffer.from(await driver.takeScreenshot(), "base64"), ContentType.PNG);
    await allure.attachmentPath("File to upload", "/tmp/file.xml", { contentType: ContentType.XML });
    await page.submit();
    await allure.attachment("Submit form", Buffer.from(await driver.takeScreenshot(), "base64"), ContentType.PNG);
  });

});
