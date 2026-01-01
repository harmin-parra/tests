Feature: Webform page

  Background:
    * driver url_form_page

  Scenario:
    * screenshot()
    # * karate.call('classpath:karate/share/web_form.feature', { login: 'login', password: 'password', textarea: "Text Area", number: 2, city: 'Los Angeles' })
    * call read('classpath:karate/share/web_form.feature') { login: 'login', password: 'password', textarea: "Text Area", number: 2, city: 'Los Angeles' }
    * screenshot()
    * match text('//h1') == "Form submitted"
