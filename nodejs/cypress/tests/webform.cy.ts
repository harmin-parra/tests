import { WebFormPage } from "../pages/webform";
import * as allure from "allure-cypress";


describe('Web interface (Cypress)', () => {

  it('Web form', () => {
    allure.description(
      "Testing the following field types of a webform :\n\n" +
      "- Input text\n" +
      "- Text area\n" +
      "- Select\n" +
      "- Checkbox\n" +
      "- Radio button\n" +
      "- File upload\n" +
      "- Color picker\n" +
      "- Date picker\n" +
      "- Input range\n" +
      "- Button\n"
    );
    allure.epic("Web interface (Cypress)");
    allure.story("Web Form");
    //allure.parentSuite("Web interface (Cypress)");
    allure.suite("Web Form");
    allure.link("https://www.selenium.dev/selenium/web/web-form.html", "Target page");
    allure.issue("123");
    allure.tms("456");

    cy.visit('https://www.selenium.dev/selenium/web/web-form.html')
    const page = new WebFormPage();
    cy.screenshot();
    page.set_input("input");
    page.set_password("password");
    page.set_textarea("textarea");
    page.set_number(2);
    page.set_city("Los Angeles");
    page.set_file("../file.xml");
    page.set_color("#00ff00");
    page.set_date("01/01/2024");
    page.set_range(1);
    cy.screenshot();
    allure.attachmentPath("File to upload", "../file.xml", { contentType: allure.ContentType.XML });
    page.submit();
    cy.screenshot();
  });

});
