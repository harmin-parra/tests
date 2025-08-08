import { By, WebDriver, WebElement, Actions } from "selenium-webdriver";

export class WebFormPage {

  driver: WebDriver;
  input!: WebElement;
  password!: WebElement;
  textarea!: WebElement;
  selectElement!: WebElement;
  city!: WebElement;
  file!: WebElement;
  color!: WebElement;
  date!: WebElement;
  range!: WebElement;
  button!: WebElement;
  number!: SelectWrapper;

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async init(): Promise<this> {
    this.input = await this.driver.findElement(By.name("my-text"));
    this.password = await this.driver.findElement(By.name("my-password"));
    this.textarea = await this.driver.findElement(By.name("my-textarea"));
    this.selectElement = await this.driver.findElement(By.name("my-select"));
    this.city = await this.driver.findElement(By.name("my-datalist"));
    this.file = await this.driver.findElement(By.name("my-file"));
    this.color = await this.driver.findElement(By.name("my-colors"));
    this.date = await this.driver.findElement(By.name("my-date"));
    this.range = await this.driver.findElement(By.name("my-range"));
    this.button = await this.driver.findElement(By.xpath("//button[@type='submit']"));
    this.number = new SelectWrapper(this.selectElement);

    return this;
  }

  async setInput(value: string): Promise<void> {
    await this.input.sendKeys(value);
  }

  async setPassword(value: string): Promise<void> {
    await this.password.sendKeys(value);
  }

  async setTextarea(value: string): Promise<void> {
    await this.textarea.sendKeys(value);
  }

  async setNumber(index: number): Promise<void> {
    await this.number.selectByIndex(index);
  }

  async setCity(value: string): Promise<void> {
    await this.city.sendKeys(value);
  }

  async setFile(filePath: string): Promise<void> {
    await this.file.sendKeys(filePath);
  }

  async setColor(value: string): Promise<void> {
    await this.driver.executeScript(
      "document.getElementsByName('my-colors')[0].value = arguments[0]",
      value
    );
  }

  async setDate(value: string): Promise<void> {
    await this.date.sendKeys(value);
    const body = await this.driver.findElement(By.css("body"));
    await body.click();
  }

  async setRange(value: number): Promise<void> {
    await this.driver.executeScript(
      "document.getElementsByName('my-range')[0].value = arguments[0]", value
    );
  }

  async submit(): Promise<void> {
    await this.button.click();
  }
}


class SelectWrapper {
  element: WebElement;

  constructor(element: WebElement) {
    this.element = element;
  }

  async selectByIndex(index: number): Promise<void> {
    const options = await this.element.findElements(By.tagName("option"));
    if (index < 0 || index >= options.length)
      throw new Error("Index out of range in selectByIndex");
    await options[index].click();
  }
}
