from playwright.sync_api import Page, expect


class WebFormPage:

    def __init__(self, page: Page):
        self.page = page
        self.input = page.locator("[id='my-text-id']")
        self.password = page.locator("[name='my-password']")
        self.textarea = page.locator("[name='my-textarea']")
        self.number = page.locator("//select[@name='my-select']")
        self.city = page.locator("//input[@name='my-datalist']")
        self.color = page.locator("[name='my-colors']")
        self.date = page.locator("[name='my-date']")
        self.range = page.locator("[name='my-range']")
        self.file = page.locator("[name='my-file']")
        self.button_submit = page.get_by_role("button", name="Submit")

    def set_input(self, value):
        self.input.fill(value)

    def set_password(self, value):
        self.password.fill(value)

    def set_textarea(self, value):
        self.textarea.fill(value)

    def set_number(self, value):
        self.number.select_option(index=value)

    def set_city(self, value):
        self.city.fill(value)

    def set_color(self, value):
        self.color.fill(value)

    def set_date(self, value):
        #self.date.fill(value)
        # Click elsewhere to close the calendar
        #self.page.locator("body").click()
        self.date.evaluate("(elem, val) => elem.setAttribute('value', val);", value)

    def set_range(self, value):
        # Two solutions
        # Solution #1: Trigger mouse events to move the range handler
        width = self.range.evaluate("elem => { return elem.getBoundingClientRect().width }")
        self.range.hover(position={'x': 0, 'y': 0})
        self.page.mouse.down()
        self.range.hover(position={'x': (width * value) / 10, 'y': 0})
        self.page.mouse.up()

        # solution #2: Set the range value directly
        self.range.fill(str(value))

    def set_file(self, value):
        self.file.set_input_files(value)

    def submit(self):
        self.button_submit.click()
