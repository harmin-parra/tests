from playwright.sync_api import Page, expect


class AjaxPage:

    def __init__(self, page: Page):
        self.page = page
        self.button = page.locator("#button")
        self.title = page.locator("#title")

    def click(self):
        self.button.click()

    def verify_text(self):
        expect(self.title).to_be_visible(timeout=15_000)
        expect(self.title).to_have_text("AJAX")
