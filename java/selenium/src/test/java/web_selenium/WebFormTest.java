package web_selenium;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.qameta.allure.*;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;

import web_selenium.WebFormPage;

public class WebFormTest extends BaseTest {

    /**
     * Testing the following field types of a webform :
     *
     * <pre>
     * - Input text
     * - Text area
     * - Select
     * - Checkbox
     * - Radio button
     * - File upload
     * - Color picker
     * - Date picker
     * - Input range
     * - Button
     * </pre>
     */
    @Test
    @Description
    @Link(name = "Target page", url = "https://www.selenium.dev/selenium/web/web-form.html")
    @Issue("JIRA-123")
    @TmsLink("TEST-456")
    @Epic("Web interface (Selenium)")
    @Story("Web Form")
    public void web_form() {
        Allure.getLifecycle().updateTestCase(tr -> tr.getLabels().removeIf(label -> "suite".equals(label.getName())));
        Allure.label("parentSuite", "Web interface (Selenium)");
        Allure.suite("Web Form");
        //Allure.feature("Web Form");
        this.driver.get("https://www.selenium.dev/selenium/web/web-form.html");
        byte[] buffer = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        Allure.addAttachment("Empty form", new ByteArrayInputStream(buffer));
        WebFormPage page = new WebFormPage(this.driver);
        page.set_input("login");
        page.set_password("password");
        page.set_textarea("textarea");
        page.set_number(2);
        page.set_city("Los Angeles");
        page.set_file("src/test/resources/file.xml");
        page.set_color("#00ff00");
        page.set_date("01/01/2024");
        page.set_range(1);
        buffer = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        Allure.addAttachment("Complete form", new ByteArrayInputStream(buffer));
        try {
            Allure.addAttachment("File to upload", "application/xml", FileUtils.readFileToString(new File("src/test/resources/file.xml"), "UTF-8"), ".xml");
        } catch (IOException e) { }
        page.submit();
        buffer = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        Allure.addAttachment("Submit form", new ByteArrayInputStream(buffer));
    }

}
