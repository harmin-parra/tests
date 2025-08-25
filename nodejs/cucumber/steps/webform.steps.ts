import { After, Before, Given, When, Then } from "@cucumber/cucumber";
import { chromium, Browser, Page } from "playwright";
import assert from "assert";
import fs from 'node:fs';
import { WebformPage } from "../pages/webform.page";


let browser: Browser;
let page: Page;
let webform: WebformPage;


Before(async function() {
  browser = await chromium.launch();
  const context = await browser.newContext({ recordVideo: { dir: 'videos/' } });
  page = await context.newPage();
});


Given("The form is empty", async function() {
  await page.goto("https://www.selenium.dev/selenium/web/web-form.html");
  webform = new WebformPage(page);
  this.attach(await page.screenshot(), "image/png");
  await page.waitForTimeout(1500);
});


When("I fill out the form", async function() {
  await webform.set_input("login");
  await webform.set_password("password");
  await webform.set_textarea("textarea");
  await webform.set_number(2);
  await webform.set_city("Los Angeles");
  await webform.set_file("../file.xml");
  await webform.set_color("#00ff00");
  await webform.set_date("01/01/2024");
  await webform.set_range(1);
  this.attach(await page.screenshot(), "image/png");
  this.attach(fs.readFileSync('../file.xml', 'utf8'), "text/xml");
  await page.waitForTimeout(1500);
});


When("I click Submit", async function() {
  await webform.submit();
  await page.waitForTimeout(1500);
});


Then("The form is submitted", async function() {
  this.attach(await page.screenshot(), "image/png");
});


After(async function () {
  await page?.context()?.close();
  const videoPath = await page?.video()?.path();
  if (videoPath)
    this.attach(fs.readFileSync(videoPath), "video/webm");
  if (browser)
    await browser.close();
});
