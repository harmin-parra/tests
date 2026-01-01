package web_selenium;

import java.net.MalformedURLException;
import java.net.URL;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;

import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

abstract class BaseTest {

    protected WebDriver driver;

    @BeforeEach
    public void setup() {
        this.driver = this.getDriver();
    }

    @AfterEach
    public void teardown() {
        try {
            this.driver.quit();
        } catch (Exception e) { }
    }

    public WebDriver getDriver() {
        WebDriver driver = null;
        String browser = StringUtils.isEmpty(System.getProperty("browser")) ? "firefox"
                : System.getProperty("browser").toLowerCase();
        boolean headless = StringUtils.isEmpty(System.getProperty("headless")) ? true
                : Boolean.parseBoolean(System.getProperty("headless").toLowerCase());
        String url = StringUtils.isEmpty(System.getProperty("hub")) ? null : System.getProperty("hub");
        URL hub = null;
        if (url != null) {
            try {
                hub = new URL("http://" + url + ":4444/wd/hub");
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
        }
        switch (browser) {
            case "firefox":
                FirefoxOptions opt1 = new FirefoxOptions();
                opt1.setCapability("webSocketUrl", true);
                if (headless)
                    opt1.addArguments("--headless");
                if (hub == null)
                    driver = new FirefoxDriver(opt1);
                else
                    driver = new RemoteWebDriver(hub, opt1);
                break;
            case "chrome":
                ChromeOptions opt2 = new ChromeOptions();
                opt2.setCapability("webSocketUrl", true);
                if (headless)
                    opt2.addArguments("--headless=new");
                if (hub == null)
                    driver = new ChromeDriver(opt2);
                else
                    driver = new RemoteWebDriver(hub, opt2);
                break;
            case "msedge": case "edge":
                EdgeOptions opt3 = new EdgeOptions();
                opt3.setCapability("webSocketUrl", true);
                if (headless)
                    opt3.addArguments("--headless=new");
                if (hub == null)
                    driver = new EdgeDriver(opt3);
                else
                    driver = new RemoteWebDriver(hub, opt3);
                break;
            case "chromium":
                ChromeOptions opt4 = new ChromeOptions();
                opt4.setCapability("webSocketUrl", true);
                if (headless)
                    opt4.addArguments("--headless=new");
                if (hub == null) {
                    opt4.setBinary("/usr/bin/chromium");
                    driver = new ChromeDriver(opt4);
                }
                else
                    driver = new RemoteWebDriver(hub, opt4);
                break;
            default:
                throw new IllegalArgumentException("Unexpected value: " + browser);
        }
        driver.manage().window().maximize();
        return driver;
    }
}
