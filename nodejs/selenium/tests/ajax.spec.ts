import { By, until, WebDriver } from "selenium-webdriver";
import assert from "node:assert";
import * as allure from "allure-js-commons";
import { ContentType } from "allure-js-commons";
import { getWebDriver, getScreenshot } from "../support/webdriver";
import { AjaxPage } from "../pages/ajax.page"; 


describe("Ajax Test", function () {
  let driver: WebDriver;

  before(async () => {
    driver = await getWebDriver();
    await driver.get("http://qa-demo.gitlab.io/reports/web/ajax.html");
  });

  after(async () => {
    await driver.quit();
  });


  it("Ajax verification", async () => {
    let page: AjaxPage = await new AjaxPage(driver).init();
    await allure.attachment("Initial page", await getScreenshot(driver), ContentType.PNG);
    await page.click();
    await allure.attachment("Trigger event", await getScreenshot(driver), ContentType.PNG);
    await page.verify_title();
    await allure.attachment("Verify event result", await getScreenshot(driver), ContentType.PNG);
  });

});
