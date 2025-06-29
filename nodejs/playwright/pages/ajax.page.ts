import { expect, type Locator, type Page } from '@playwright/test';


class AjaxPage {

  page: Page;
  button: Locator;
  title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.button = page.locator("#button");
    this.title = page.locator("#title");
  }


  async click() {
    await this.button.click();
  }

  async verify() {
    await expect(this.title).toBeVisible();
    await expect(this.title).toHaveText("AJAX");
  }

}

export default AjaxPage;
