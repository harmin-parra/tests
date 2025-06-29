import allure
import time
from playwright.sync_api import Browser, expect
import pages


@allure.link("https://www.selenium.dev/selenium/web/web-form.html", name="Target webpage")
@allure.issue("JIRA-123")
@allure.testcase("TEST-456")
@allure.parent_suite("Web interface (Playwright)")
@allure.suite("Ajax page")
@allure.epic("Web interface (Playwright)")
#@allure.story("Ajax")
@allure.feature("Ajax page")
def test_ajax_verification(browser: Browser):
    """ 
    Testing an AJAX page.
    
    Test using page.expect_response()
    """
    context = browser.new_context(record_video_dir="videos/")
    page = context.new_page()
    page.goto("http://qa-demo.gitlab.io/reports/web/ajax.html")
    # extras.save_screenshot_for_playwright(page, comment="Initial page")
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
        # extras.save_screenshot_for_playwright(page, comment="Trigger event")
        allure.attach(
            page.screenshot(full_page=True),
            name="Trigger event",
            attachment_type=allure.attachment_type.PNG
        )

    ajax.verify_text()
    # extras.save_screenshot_for_playwright(page, comment="Verify event result")
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


# @allure.parent_suite("Web interface (Playwright)")
# @allure.suite("Ajax")
# @allure.epic("Web interface (Playwright)")
# @allure.story("Ajax")
# @allure.feature("Ajax using expect")
# def test_ajax_verification_with_expect(page: Page):
#     """ Ajax test using sleep() and default timeout """
#     page.goto("http://qa-demo.gitlab.io/reports/web/ajax.html")
#     allure.attach(
#         page.screenshot(full_page=True),
#         name="Initial page",
#         attachment_type=allure.attachment_type.PNG
#     )
#     ajax = pages.AjaxPage(page)
#
#     ajax.click()
#     allure.attach(
#         page.screenshot(full_page=True),
#         name="Trigger event",
#         attachment_type=allure.attachment_type.PNG
#     )
#
#     ajax.verify_text()
#     allure.attach(
#         page.screenshot(full_page=True),
#         name="Verify event result",
#         attachment_type=allure.attachment_type.PNG
#     )
