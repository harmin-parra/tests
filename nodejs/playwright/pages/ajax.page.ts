import { expect, type Locator, type Page } from '@playwright/test';

export class AjaxPage {

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

  async wait_event() {
    await expect(this.title).toBeVisible({ timeout: 15000 });
  }

  async verify_title() {
    await expect(this.title).toHaveText("AJAX");
  }

}
