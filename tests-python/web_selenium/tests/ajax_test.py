import allure
from web_selenium.conftest import driver
from web_selenium import pages


@allure.link("https://www.selenium.dev/selenium/web/web-form.html", name="Target webpage")
@allure.issue("JIRA-123")
@allure.testcase("TEST-456")
@allure.parent_suite("Web interface (Selenium)")
@allure.suite("Ajax")
@allure.epic("Web interface (Selenium)")
#@allure.story("Ajax")
@allure.feature("Ajax")
def test_ajax_response(driver):
    """
    Testing a webpage using AJAX.

    Test using WebDriverWait.until()
    """
    driver.get("http://harmin-demo.gitlab.io/reports/web/ajax.html")
    allure.attach(
        driver.get_screenshot_as_png(),
        name="Initial page",
        attachment_type=allure.attachment_type.PNG
    )
    ajax = pages.AjaxPage(driver)
    ajax.click()
    allure.attach(
        driver.get_screenshot_as_png(),
        name="Trigger event",
        attachment_type=allure.attachment_type.PNG
    )
    ajax.verify()
    allure.attach(
        driver.get_screenshot_as_png(),
        name="Verify event result",
        attachment_type=allure.attachment_type.PNG
    )
