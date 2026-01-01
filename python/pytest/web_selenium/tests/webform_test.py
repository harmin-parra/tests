import os
from conftest import driver
from web_selenium import pages


def test_web_form(driver, report):
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
    report.screenshot("Empty form", driver)
    webform = pages.WebFormPage(driver)
    webform.set_input("login")
    webform.set_password("password")
    webform.set_textarea("My textarea")
    webform.set_number(2)
    webform.set_city("Los Angeles")
    xml_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "file.xml"))
    report.attach("File to upload:", source=xml_file, mime=report.Mime.XML)
    webform.set_file(xml_file)
    webform.set_color("#00ff00")
    webform.set_date("01/01/2024")
    webform.set_range(1)
    report.screenshot("Complete form", driver)
    webform.submit()
    report.screenshot("Submit form", driver)
