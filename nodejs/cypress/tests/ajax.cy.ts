import { AjaxPage } from "../pages/ajax";
import * as allure from "allure-cypress";


describe("Web interface (Cypress)", () => {

  it("Ajax verification with intercept", () =>{
    allure.description("Testing an AJAX page\n\nTest using ``intercept()``");
    allure.epic("Web interface (Cypress)");
    allure.story("Ajax");
    //allure.parentSuite("Web interface (Cypress)");
    allure.suite("Ajax");
    allure.link("http://qa-demo.gitlab.io/reports/web/ajax.html", "Target page");
    allure.issue("123");
    allure.tms("456");

    cy.visit("http://qa-demo.gitlab.io/reports/web/ajax.html")
    const page = new AjaxPage();
    cy.screenshot();
    page.click();
    cy.screenshot();
    // cy.intercept("GET", "**/ajax.txt", { body: "<h1 id='title'>MOCK</h1>" }).as("ajaxResponse");
    cy.intercept("GET", "**/ajax.txt").as("ajaxResponse");
    cy.wait("@ajaxResponse", {timeout: 15000}).its("response.statusCode").should("equal", 200);
    cy.screenshot();
    page.verify();
  });


  it("Ajax verification with get+should", () =>{
    allure.description("Testing an AJAX page\n\nTest using ``get().should('exist')``");
    allure.epic("Web interface (Cypress)");
    allure.story("Ajax");
    //allure.parentSuite("Web interface (Cypress)");
    allure.suite("Ajax");
    allure.link("http://qa-demo.gitlab.io/reports/web/ajax.html", "Target page");
    allure.issue("123");
    allure.tms("456");

    cy.visit("http://qa-demo.gitlab.io/reports/web/ajax.html")
    const page = new AjaxPage();
    cy.screenshot();
    page.click();
    cy.screenshot();
    cy.get("#title", {timeout: 15000}).should("exist");
    cy.screenshot();
    page.verify();
  });

});
