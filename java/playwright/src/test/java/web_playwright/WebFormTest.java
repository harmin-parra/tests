package web_playwright;

import web_playwright.WebFormPage;
import com.microsoft.playwright.Page;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import io.qameta.allure.*;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Test;

public class WebFormTest extends BaseTest {

    /**
     * Testing the following field types of a webform :
     *
     * <ul style="font-family: monospace;">
     *   <li>Input text</li>
     *   <li>Text area</li>
     *   <li>Select</li>
     *   <li>Checkbox</li>
     *   <li>Radio button</li>
     *   <li>File upload</li>
     *   <li>Color picker</li>
     *   <li>Date picker</li>
     *   <li>Input range</li>
     *   <li>Button</li>
     * </ul>
     */
    @Test
    @Description(useJavaDoc = true)
    @Link(name = "Target page", url = "https://www.selenium.dev/selenium/web/web-form.html")
    @Issue("JIRA-123")
    @TmsLink("TEST-456")
    @Epic("Web interface (Playwright)")
    @Story("Web Form")
    public void web_form() {
        Allure.getLifecycle().updateTestCase(tr -> tr.getLabels().removeIf(label -> "suite".equals(label.getName())));
        Allure.label("parentSuite", "Web interface (Playwright)");
        Allure.suite("Web Form");
        //Allure.feature("Web Form");
        //this.createContextAndPageForVideo();
        this.page.navigate("https://www.selenium.dev/selenium/web/web-form.html");
        WebFormPage webform = new WebFormPage(page);
        try{ Thread.sleep(1500); } catch(Exception e) { }
        byte[] buffer = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
        Allure.addAttachment("Empty form", new ByteArrayInputStream(buffer));
        webform.set_input("login");
        webform.set_password("password");
        webform.set_textarea("textarea");
        webform.set_number(2);
        webform.set_city("Los Angeles");
        webform.set_file("src/test/resources/file.xml");
        webform.set_color("#00ff00");
        webform.set_date("01/01/2024");
        webform.set_range(1);
        try{ Thread.sleep(1500); } catch(Exception e) { }
        buffer = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
        Allure.addAttachment("Complete form", new ByteArrayInputStream(buffer));
        try {
            Allure.addAttachment("File to upload", "application/xml", FileUtils.readFileToString(new File("src/test/resources/file.xml"), "UTF-8"), ".xml");
        } catch (IOException e) { }
        webform.submit();
        assertThat(this.page.locator("//h1")).hasText("Form submitted");
        try{ Thread.sleep(1500); } catch(Exception e) { }
        buffer = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
        Allure.addAttachment("Submit form", new ByteArrayInputStream(buffer));
        this.closeContext();
        try {
            Allure.addAttachment("Recorded video", "video/webm", Files.newInputStream(page.video().path()), "webm");
        } catch (IOException e) { }
    }
}
