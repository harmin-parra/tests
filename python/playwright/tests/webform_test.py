import allure
import os
from playwright.sync_api import Browser
import pages


@allure.link("https://www.selenium.dev/selenium/web/web-form.html", name="Target webform")
@allure.issue("JIRA-123")
@allure.testcase("TEST-456")
@allure.parent_suite("Web interface (Playwright)")
@allure.suite("Web Form")
@allure.epic("Web interface (Playwright)")
# @allure.story("Web Form")
@allure.feature("Web Form")
def test_web_form(browser: Browser):
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
    # extras.screenshot_for_playwright(page, comment="Empty form")
    allure.attach(
        page.screenshot(full_page=True),
        name="Empty form",
        attachment_type=allure.attachment_type.PNG
    )
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
    # extras.screenshot_for_playwright(page, comment="Complete form")
    allure.attach(
        page.screenshot(full_page=True),
        name="Complete form",
        attachment_type=allure.attachment_type.PNG
    )
    allure.attach(
        open(os.path.join("..", "file.xml")).read(),
        name="File to upload",
        attachment_type=allure.attachment_type.XML
    )
    webform.submit()
    # extras.screenshot_for_playwright(page, comment="Submit form")
    allure.attach(
        page.screenshot(full_page=True),
        name="Submit form",
        attachment_type=allure.attachment_type.PNG
    )
    context.close()
    page.close()
    allure.attach.file(
        source=page.video.path(),
        name="Recorded video",
        attachment_type=allure.attachment_type.WEBM
    )
