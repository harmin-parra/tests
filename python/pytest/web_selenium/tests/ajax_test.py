from conftest import driver
from web_selenium import pages


def test_ajax_verification(driver, report):
    """
    Testing an AJAX page.

    Test using WebDriverWait().until()
    """
    driver.get("http://qa-demo.gitlab.io/reports/web/ajax.html")
    report.screenshot("Initial page", driver)
    ajax = pages.AjaxPage(driver)
    ajax.click()
    report.screenshot("Trigger event", driver)
    ajax.wait_event()
    ajax.verify_title()
    report.screenshot("Verify event result", driver)
