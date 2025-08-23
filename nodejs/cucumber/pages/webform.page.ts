import { expect, type Locator, type Page } from '@playwright/test';

export class WebformPage {

  page: Page;
  input: Locator;
  password: Locator;
  textarea: Locator;
  number: Locator;
  city: Locator;
  color: Locator;
  date: Locator;
  range: Locator;
  file: Locator;
  button: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.locator("[id='my-text-id']");
    this.password = page.locator("[name='my-password']");
    this.textarea = page.locator("[name='my-textarea']");
    this.number = page.locator("//select[@name='my-select']");
    this.city = page.locator("//input[@name='my-datalist']");
    this.color = page.locator("[name='my-colors']");
    this.date = page.locator("[name='my-date']");
    this.range = page.locator("[name='my-range']");
    this.file = page.locator("[name='my-file']");
    this.button = page.getByRole("button", { name: "Submit" });
  }

  async set_input(value: string) {
    await this.input.fill(value);
  }

  async set_password(value: string) {
    await this.password.fill(value);
  }

  async set_textarea(value: string) {
    await this.textarea.fill(value);
  }

  async set_number(value: number) {
    await this.number.selectOption({ index: value });
  }

  async set_city(value: string) {
    await this.city.fill(value);
  }

  async set_color(value: string) {
    await this.color.fill(value);
  }

  async set_date(value: string) {
    await this.date.evaluate((elem, value) => elem.setAttribute("value", value), value);
  }

  async set_file(value: string) {
    await this.file.setInputFiles(value);
  }

  async set_range(value: number) {
    await this.range.fill(value.toString());
  }

  async submit() {
    await this.button.click();
  }

}
