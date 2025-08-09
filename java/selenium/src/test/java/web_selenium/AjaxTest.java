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

public class AjaxTest extends BaseTest {

    /**
     * Testing an AJAX page.
     *
     * Test using <span style="font-family:'Courier New'">WebDriverWait().until()</span>.
     */
    @Test
    @Description
    public void ajax_verification() {
        Allure.getLifecycle().updateTestCase(tr -> tr.getLabels().removeIf(label -> "suite".equals(label.getName())));
        Allure.epic("Web interface (Selenium)");
        Allure.story("Ajax");
        Allure.suite("Web interface (Selenium)");
        //Allure.feature("Ajax");
        this.driver.get("http://qa-demo.gitlab.io/reports/web/ajax.html");
        byte[] buffer = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        Allure.addAttachment("Open page", new ByteArrayInputStream(buffer));
        AjaxPage page = new AjaxPage(this.driver);
        page.click();
        buffer = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        Allure.addAttachment("Trigger event", new ByteArrayInputStream(buffer));
        page.wait_event();
        buffer = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        Allure.addAttachment("Verify event result", new ByteArrayInputStream(buffer));
        page.verify_title();
    }

}
