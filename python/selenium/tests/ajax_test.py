import allure
from conftest import driver
import pages


@allure.link("http://qa-demo.gitlab.io/reports/web/ajax.html", name="Target page")
@allure.issue("JIRA-123", name="JIRA-123")
@allure.testcase("TEST-456", name="TEST-456")
@allure.parent_suite("Web interface (Selenium)")
@allure.suite("Ajax")
@allure.epic("Web interface (Selenium)")
# @allure.story("Ajax")
@allure.feature("Ajax")
def test_ajax_verification(driver):
    """
    Testing an AJAX page.

    Test using WebDriverWait().until()
    """
    driver.get("http://qa-demo.gitlab.io/reports/web/ajax.html")
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
    ajax.verify_title()
    allure.attach(
        driver.get_screenshot_as_png(),
        name="Verify event result",
        attachment_type=allure.attachment_type.PNG
    )
