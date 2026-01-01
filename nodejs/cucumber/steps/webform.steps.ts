import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert";
import fs from 'node:fs';
import { WebformPage } from "../pages/webform.page";
import { CustomWorld } from "../support/world";

let webform: WebformPage;


Given("The form is empty", async function(this: CustomWorld) {
  await this.ui.page.goto("https://www.selenium.dev/selenium/web/web-form.html");
  webform = new WebformPage(this.ui.page);
  this.attach(await this.ui.page.screenshot(), "image/png");
  await this.ui.page.waitForTimeout(1500);
});


When("I fill out the form", async function(this: CustomWorld) {
  await webform.set_input("login");
  await webform.set_password("password");
  await webform.set_textarea("textarea");
  await webform.set_number(2);
  await webform.set_city("Los Angeles");
  await webform.set_file("../file.xml");
  await webform.set_color("#00ff00");
  await webform.set_date("01/01/2024");
  await webform.set_range(1);
  this.attach(await this.ui.page.screenshot(), "image/png");
  this.attach(fs.readFileSync('../file.xml', 'utf8'), "text/xml");
  await this.ui.page.waitForTimeout(1500);
});


When("I click Submit", async function(this: CustomWorld) {
  await webform.submit();
  await this.ui.page.waitForTimeout(1500);
});


Then("The form is submitted", async function(this: CustomWorld) {
  this.attach(await this.ui.page.screenshot(), "image/png");
});
