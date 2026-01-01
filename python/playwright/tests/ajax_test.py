import allure
import time
from playwright.sync_api import Browser, expect
import pages


@allure.link("http://qa-demo.gitlab.io/reports/web/ajax.html", name="Target page")
@allure.issue("JIRA-123", name="JIRA-123")
@allure.testcase("TEST-456", name="TEST-456")
@allure.parent_suite("Web interface (Playwright)")
@allure.suite("Ajax")
@allure.epic("Web interface (Playwright)")
#@allure.story("Ajax")
@allure.feature("Ajax")
def test_ajax_verification_with_intercept(browser: Browser):
    """ 
    Testing an AJAX page.
    
    Test using page.expect_response()
    """
    context = browser.new_context(record_video_dir="videos/")
    page = context.new_page()
    page.goto("http://qa-demo.gitlab.io/reports/web/ajax.html")
    allure.attach(
        page.screenshot(full_page=True),
        name="Open page",
        attachment_type=allure.attachment_type.PNG
    )
    ajax = pages.AjaxPage(page)

    # page.route("**/ajax.txt", lambda route: route.fulfill(
    #     body="<h1 id='title'>MOCK</h1>")
    # )
    with page.expect_response("**/ajax.txt") as response:
        ajax.click()
        allure.attach(
            page.screenshot(full_page=True),
            name="Trigger event",
            attachment_type=allure.attachment_type.PNG
        )

    ajax.verify_title()
    allure.attach(
        page.screenshot(full_page=True),
        name="Verify event result",
        attachment_type=allure.attachment_type.PNG
    )
    context.close()
    page.close()
    allure.attach.file(
        source=page.video.path(),
        name="Recorded video",
        attachment_type=allure.attachment_type.WEBM
    )


@allure.link("http://qa-demo.gitlab.io/reports/web/ajax.html", name="Target page")
@allure.issue("JIRA-123", name="JIRA-123")
@allure.testcase("TEST-456", name="TEST-456")
@allure.parent_suite("Web interface (Playwright)")
@allure.suite("Ajax")
@allure.epic("Web interface (Playwright)")
@allure.story("Ajax")
@allure.feature("Ajax using expect")
def test_ajax_verification_with_expect(browser: Browser):
    """
    Testing an AJAX page.

    Test using expect().to_be_visible(timeout)
    """
    context = browser.new_context(record_video_dir="videos/")
    page = context.new_page()
    page.goto("http://qa-demo.gitlab.io/reports/web/ajax.html")
    allure.attach(
        page.screenshot(full_page=True),
        name="Initial page",
        attachment_type=allure.attachment_type.PNG
    )
    ajax = pages.AjaxPage(page)

    ajax.click()
    allure.attach(
        page.screenshot(full_page=True),
        name="Trigger event",
        attachment_type=allure.attachment_type.PNG
    )

    ajax.wait_event()
    ajax.verify_title()
    allure.attach(
        page.screenshot(full_page=True),
        name="Verify event result",
        attachment_type=allure.attachment_type.PNG
    )
    context.close()
    page.close()
    allure.attach.file(
        source=page.video.path(),
        name="Recorded video",
        attachment_type=allure.attachment_type.WEBM
    )
