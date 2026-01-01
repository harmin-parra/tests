from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.remote.file_detector import LocalFileDetector


class WebFormPage:

    def __init__(self, driver):
        self.driver = driver
        self.input = driver.find_element(By.NAME, "my-text")
        self.password = driver.find_element(By.NAME, "my-password")
        self.textarea = driver.find_element(By.NAME, "my-textarea")
        self.number = Select(driver.find_element(By.NAME, "my-select"))
        self.city = driver.find_element(By.NAME, "my-datalist")
        self.driver.file_detector = LocalFileDetector()
        self.file = driver.find_element(By.NAME, "my-file")
        self.color = driver.find_element(By.NAME, "my-colors")
        self.date = driver.find_element(By.NAME, "my-date")
        self.range = driver.find_element(By.NAME, "my-range")
        self.button = driver.find_element(By.XPATH, "//button[@type='submit']")

    def set_input(self, value):
        self.input.send_keys(value)

    def set_password(self, value):
        self.password.send_keys(value)

    def set_textarea(self, value):
        self.textarea.send_keys(value)

    def set_number(self, value):
        self.number.select_by_index(value)

    def set_city(self, value):
        self.city.send_keys(value)

    def set_file(self, value):
        self.file.send_keys(value)

    def set_color(self, value):
        self.driver.execute_script(f"document.getElementsByName('my-colors')[0].value = '{value}'")

    def set_date(self, value):
        self.date.send_keys(value)
        # Click elsewhere to close the calendar
        self.driver.find_element(By.XPATH, "//body").click()

    def set_range(self, value):
        # Two solutions
        # Solution #1: Trigger mouse events to move the range handler
        dimensions = self.range.rect
        current = int(self.range.get_attribute("value"))
        step = dimensions['width'] / (int(self.range.get_attribute("max")) - int(self.range.get_attribute("min")))
        offset = (value - current) * step
        action = ActionChains(self.driver)
        action.move_to_element_with_offset(self.range, offset, 0).click().perform()

        # solution #2: Set the range value directly
        self.driver.execute_script(f"document.getElementsByName('my-range')[0].value = '{value}'")

    def submit(self):
        self.button.click()
