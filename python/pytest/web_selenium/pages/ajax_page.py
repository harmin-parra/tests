from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class AjaxPage:

    def __init__(self, driver):
        self.driver = driver
        self.button = driver.find_element(By.ID, "button")
        # self.title = driver.find_element(By.ID, "title")

    def click(self):
        self.button.click()

    def verify(self):
        wait = WebDriverWait(self.driver, 15)
        wait.until(EC.presence_of_element_located((By.ID, "title")))
        title = self.driver.find_element(By.ID, "title")
        assert title.text == "AJAX"
