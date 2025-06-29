Feature: Web form page

  Background:
    * driver url_form_page

  @allure.label.epic:Web_interface_(Karate)
  #@allure.label.parentSuite:Web_interface_(Karate)
  @allure.label.suite:Web_interface_(Karate)
  Scenario:
    * screenshot()
    * input('#my-text-id', 'login')
    * input('input[name=my-password]', 'password')
    * input('textarea[name=my-textarea]', 'Hello, World!')
    * select('select[name=my-select]', 2)
    # * if (browser == 'chrome') driver.inputFile('input[name=my-file]', '/tmp/test/file.txt')
    * input('input[name=my-datalist]', 'Los Angeles')
    * script("document.getElementsByName('my-colors')[0].value = '#00FF00';")
    * script("document.getElementsByName('my-date')[0].value = '01/01/2024';")
    * click('//body')
    * script("document.getElementsByName('my-range')[0].value = 1;")
    * screenshot()
    * submit().click('button')
    * screenshot()
    # * submit().click('button[@type="submit"]')
    * match text('//h1') == "Form submitted"
