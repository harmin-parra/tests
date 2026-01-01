export class AjaxPage {

  private elements = {
    button : () => cy.get("#button"),
    title : () => cy.get("#title")
  }

  public click() {
    this.elements.button().click();
  }

  public verify() {
    this.elements.title().should('exist');
    this.elements.title().should("have.text", "AJAX");
  }

}
