import { By, WebDriver, WebElement, until } from "selenium-webdriver";
import assert from "assert";

export class AjaxPage {
  driver: WebDriver;
  button!: WebElement;

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async init(): Promise<this> {
    this.button = await this.driver.findElement(By.id("button"));
    return this;
  }

  async click(): Promise<void> {
    await this.button.click();
  }

  async verify_title(): Promise<void> {
    // Wait up to 15 seconds until element with ID "title" is present
    await this.driver.wait(until.elementLocated(By.id("title")), 15000);

    const title = await this.driver.findElement(By.id("title"));
    const text = await title.getText();

    assert.strictEqual(text, "AJAX", `Expected title text to be "AJAX" but got "${text}"`);
  }
}
