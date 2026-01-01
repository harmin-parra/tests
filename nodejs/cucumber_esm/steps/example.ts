import { After, Before, Given, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, Browser, Page } from "playwright";
import assert from "assert";
import { expect } from "chai";


//setDefaultTimeout(2 * 60 * 1000);

let browser: Browser;
let page: Page;

Before(async () => {
  browser = await chromium.launch();
  const context = await browser.newContext();
  page = await context.newPage();
});


Given("I open Google's homepage", async function() {
  await page.goto("https://www.google.com");
  const screenshot = await page.screenshot();
  this.attach(screenshot, "image/png");
});


Then("the title should contain {string}", async (expectedTitle: string) => {
  const title = await page.title();
  assert(title.includes(expectedTitle));
  expect(title).to.contain(expectedTitle);
});


After(async () => {
  if (browser)
    await browser.close();
});
