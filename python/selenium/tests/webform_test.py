import allure
import os
import pages


@allure.link("https://www.selenium.dev/selenium/web/web-form.html", name="Target page")
@allure.issue("JIRA-123", name="JIRA-123")
@allure.testcase("TEST-456", name="TEST-456")
@allure.parent_suite("Web interface (Selenium)")
@allure.suite("Web Form")
@allure.epic("Web interface (Selenium)")
# @allure.story("Web Form")
@allure.feature("Web Form")
def test_web_form(driver):
    """
    Testing the following field types of a webform :

    - Input text
    - Text area
    - Select
    - Checkbox
    - Radio button
    - File upload
    - Color picker
    - Date picker
    - Input range
    - Button
    """
    driver.get("https://www.selenium.dev/selenium/web/web-form.html")
    allure.attach(
        driver.get_screenshot_as_png(),
        name="Empty form",
        attachment_type=allure.attachment_type.PNG
    )
    webform = pages.WebFormPage(driver)
    webform.set_input("login")
    webform.set_password("password")
    webform.set_textarea("My textarea")
    webform.set_number(2)
    webform.set_city("Los Angeles")
    xml_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "file.xml"))
    webform.set_file(xml_file)
    webform.set_color("#00ff00")
    webform.set_date("01/01/2024")
    webform.set_range(1)
    allure.attach(
        driver.get_screenshot_as_png(),
        name="Complete form",
        attachment_type=allure.attachment_type.PNG
    )
    allure.attach(
        open(xml_file).read(),
        name="File to upload",
        attachment_type=allure.attachment_type.XML
    )
    webform.submit()
    allure.attach(
        driver.get_screenshot_as_png(),
        name="Submit form",
        attachment_type=allure.attachment_type.PNG
    )
