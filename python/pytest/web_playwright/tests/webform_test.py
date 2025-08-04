import os
import time
from playwright.sync_api import Browser
from web_playwright import pages


def test_web_form(browser: Browser, report):
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
    context = browser.new_context(record_video_dir="videos/")
    page = context.new_page()
    page.goto("https://www.selenium.dev/selenium/web/web-form.html")
    time.sleep(1.5)
    report.screenshot("Empty form", page)
    webform = pages.WebFormPage(page)
    webform.set_input("login")
    webform.set_password("password")
    webform.set_textarea("My textarea")
    webform.set_number(2)
    webform.set_city("Los Angeles")
    webform.set_file(os.path.join("..", "file.xml"))
    webform.set_color("#00ff00")
    webform.set_date("01/01/2024")
    webform.set_range(1)
    time.sleep(1.5)
    report.screenshot("Complete form", page)
    report.attach("File to upload", source=os.path.join("..", "file.xml"), mime="xml")
    webform.submit()
    time.sleep(1.5)
    report.screenshot("Submit form", page)
    context.close()
    page.close()
    report.attach("Recorded video", source=page.video.path(), mime="webm")
