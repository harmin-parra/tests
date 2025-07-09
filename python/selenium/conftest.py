import pytest

from selenium import webdriver
from selenium.webdriver.firefox.options import Options as Options_Firefox
from selenium.webdriver.chrome.options import Options as Options_Chrome
from selenium.webdriver.chromium.options import ChromiumOptions as Options_Chromium
from selenium.webdriver.edge.options import Options as Options_Edge
from selenium.webdriver.chromium.webdriver import ChromiumDriver as WebDriver_Chromium
from selenium.webdriver.chromium.service import ChromiumService as Service_Chromium


def pytest_addoption(parser):
    parser.addoption("--driver", action="store", default="firefox")
    parser.addoption("--headless", action="store", default="true")
    parser.addoption("--hub", action="store", default=None)


@pytest.fixture(scope='session')
def optdriver(request):
    return request.config.getoption("--driver").lower()


@pytest.fixture(scope='session')
def optheadless(request):
    opt = request.config.getoption("--headless").lower()
    return True if opt == "true" else False


@pytest.fixture(scope='session')
def opthub(request):
    return request.config.getoption("--hub")


@pytest.fixture(scope="function")
def driver(optdriver, optheadless, opthub):
    _driver = None
    options = None
    if optdriver == "chrome":
        options = Options_Chrome()
        if optheadless:
            options.add_argument("--headless=new")
        if opthub is None:
            _driver = webdriver.Chrome(options=options)
    elif optdriver == "chromium":
        options = Options_Chromium()
        if optheadless:
            options.add_argument("--headless=new")
        if opthub is None:
            _driver = WebDriver_Chromium(
                browser_name="Chromium",
                vendor_prefix="Chromium",
                options=options,
                service=Service_Chromium()
            )
    elif optdriver == "firefox":
        options = Options_Firefox()
        if optheadless:
            options.add_argument("--headless")
        if opthub is None:
            _driver = webdriver.Firefox(options=options)
    elif optdriver == "msedge":
        options = Options_Edge()
        if optheadless:
            options.add_argument("--headless=new")
        if opthub is None:
            _driver = webdriver.Edge(options=options)
    if opthub is not None:
        server = f"http://{opthub}:4444/wd/hub"
        _driver = webdriver.Remote(command_executor=server, options=options)
    yield _driver
    _driver.quit()
