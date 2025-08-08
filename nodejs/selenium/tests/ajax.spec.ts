import { By, until, WebDriver } from "selenium-webdriver";
import assert from "node:assert";
import * as allure from "allure-js-commons";
import { ContentType } from "allure-js-commons";
import { getWebDriver } from "../support/webdriver";
import { AjaxPage } from "../pages/ajax.page"; 


describe("Ajax Test", function () {
  let driver: WebDriver;

  before(async () => {
    driver = await getWebDriver();
  });

  after(async () => {
    await driver.quit();
  });


  it("Ajax verification", async () => {
    await driver.get("http://qa-demo.gitlab.io/reports/web/ajax.html");
    let page: AjaxPage = await new AjaxPage(driver).init();
    await allure.attachment("Initial page", Buffer.from(await driver.takeScreenshot(), "base64"), ContentType.PNG);
    await page.click();
    await allure.attachment("Trigger event", Buffer.from(await driver.takeScreenshot(), "base64"), ContentType.PNG);
    await page.verify();
    await allure.attachment("Verify event result", Buffer.from(await driver.takeScreenshot(), "base64"), ContentType.PNG);
  });

});
