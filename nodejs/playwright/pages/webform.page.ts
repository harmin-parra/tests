import { expect, type Locator, type Page } from '@playwright/test';


class WebformPage {

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
    this.input = page.getByLabel("Text input");
    this.password = page.getByLabel("Password");
    this.textarea = page.getByLabel("Textarea");
    this.number = page.locator("//select[@name='my-select']");
    this.city = page.locator("//input[@name='my-datalist']");
    this.color = page.getByLabel("Color picker");
    this.date = page.getByLabel("Date picker");
    this.range = page.getByLabel("Example range");
    this.file = page.getByLabel("File input");
    this.button = page.getByRole("button", { name: "Submit" });
  }

  async set_input(value) {
    await this.input.fill(value);
  }

  async set_password(value) {
    await this.password.fill(value);
  }

  async set_textarea(value) {
    await this.textarea.fill(value);
  }

  async set_number(value) {
    await this.number.selectOption({ index: value });
  }

  async set_city(value) {
    await this.city.fill(value);
  }

  async set_color(value) {
    await this.color.fill(value);
  }

  async set_date(value) {
    await this.date.evaluate((elem, value) => elem.setAttribute("value", value), value);
  }

  async set_file(value) {
    await this.file.setInputFiles(value);
  }

  async set_range(value) {
    await this.range.fill(value.toString());
  }

  async submit() {
    await this.button.click();
  }

}

export default WebformPage;
