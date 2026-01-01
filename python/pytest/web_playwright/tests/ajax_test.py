from playwright.sync_api import Browser, expect
from web_playwright import pages


def test_ajax_verification(browser: Browser, report):
    """
    Testing an AJAX page.

    Test using page.expect_response()
    """
    context = browser.new_context(record_video_dir="videos/")
    page = context.new_page()
    page.goto("http://qa-demo.gitlab.io/reports/web/ajax.html")
    report.screenshot("Initial page", page)
    ajax = pages.AjaxPage(page)

    # page.route("**/ajax.txt", lambda route: route.fulfill(
    #     body="<h1 id='title'>MOCK</h1>")
    # )
    with page.expect_response("**/ajax.txt") as response:
        ajax.click()
        report.screenshot("Trigger event", page)

    ajax.verify_title()
    report.screenshot("Verify event result", page)
    context.close()
    page.close()
    report.attach("Recorded video", source=page.video.path(), mime="webm")


# def test_ajax_verification_with_expect(page: Page, report):
#     """
#     Testing an AJAX page.
#
#     Test using expect().to_be_visible(timeout)
#     """
#     page.goto("http://qa-demo.gitlab.io/reports/web/ajax.html")
#     report.screenshot("Initial page", page)
#     ajax = pages.AjaxPage(page)
#     ajax.click()
#     report.screenshot("Trigger event", page)
#     ajax.wait_event()
#     ajax.verify_title()
#     report.screenshot("Verify event result", page)
