class WebFormPage {

  elements = {
    input : () => cy.get('#my-text-id'),
    password : () => cy.get(':nth-child(1) > :nth-child(2) > .form-control'),
    textarea : () => cy.get(':nth-child(1) > :nth-child(3) > .form-control'),
    number : () => cy.get('.form-select'),
    city : () => cy.get(':nth-child(2) > :nth-child(2) > .form-control'),
    file : () => cy.get(':nth-child(2) > :nth-child(3) > .form-control'),
    color : () => cy.get(':nth-child(3) > :nth-child(1) > .form-control'),
    date : () => cy.get(':nth-child(3) > :nth-child(2) > .form-control'),
    range : () => cy.get('.form-range'),
    button : () => cy.get('.btn')
  }

  set_input(value) {
    this.elements.input().type(value);
  }

  set_password(value) {
    this.elements.password().type(value);
  }

  set_textarea(value) {
    this.elements.textarea().type(value);
  }

  set_number(value) {
    this.elements.number().select(value.toString());
  }

  set_city(value) {
    this.elements.city().type(value);
  }

  set_file(value) {
    this.elements.file().selectFile(value);
  }

  set_color(value) {
    this.elements.color().invoke('val', value);
  }

  set_date(value) {
    this.elements.date().type(value);
    cy.get("body").click();
    //this.elements.date().invoke('val', value);
    //this.elements.date().then(($elem) => $elem.val(value));
  }

  set_range(value) {
    this.elements.range().invoke('val', value).trigger('change');
  }

  submit() {
    this.elements.button().click()
  }

}

//module.exports = WebFormPage;
//export default WebFormPage;
export { WebFormPage };
