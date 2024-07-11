package web_selenium;

import java.io.ByteArrayInputStream;
import java.net.MalformedURLException;
import java.net.URL;

import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.qameta.allure.Allure;
import io.qameta.allure.Description;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;

import web_selenium.AjaxPage;

public class AjaxTest {

    private WebDriver driver;

    @BeforeEach
    public void setup() {
        this.driver = Common.getDriver();
    }

    /**
     * Testing a webpage using AJAX.
     *
     * Test using <span style="font-family:'Courier New'">WebDriverWait.until()</span>
     */
    @Test
    @Description
    public void ajax_response() {
        Allure.getLifecycle().updateTestCase(tr -> tr.getLabels().removeIf(label -> "suite".equals(label.getName())));
        Allure.epic("Web interface (Selenium)");
        // Allure.story("Web Form");
        Allure.suite("Web interface (Selenium)");
        Allure.feature("Ajax page");
        this.driver.get("http://harmin-demo.gitlab.io/reports/web/ajax.html");
        byte[] buffer = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        Allure.addAttachment("Initial page", new ByteArrayInputStream(buffer));
        AjaxPage page = new AjaxPage(this.driver);
        page.click();
        buffer = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        Allure.addAttachment("Trigger event", new ByteArrayInputStream(buffer));
        page.wait_ajax();
        buffer = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        Allure.addAttachment("Verify event result", new ByteArrayInputStream(buffer));
        page.verify();
    }

    @AfterEach
    public void teardown() {
        try {
            this.driver.quit();
        } catch (Exception e) { }
    }
}
