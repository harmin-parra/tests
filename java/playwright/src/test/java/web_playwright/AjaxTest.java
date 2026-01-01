package web_playwright;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;

import io.qameta.allure.*;

import org.junit.jupiter.api.Test;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.Response;


public class AjaxTest extends BaseTest {

    /**
     * Testing an AJAX page.
     *
     * Test using <code>page.waitForResponse</code>.
     */
    @Test
    @Description(useJavaDoc = true)
    @Link(name = "Target page", url = "https://qa-demo.gitlab.io/reports/web/ajax.html")
    @Issue("JIRA-123")
    @TmsLink("TEST-456")
    @Epic("Web interface (Playwright)")
    @Story("Ajax")
    public void ajax_verification_with_intercept() {
        Allure.getLifecycle().updateTestCase(tr -> tr.getLabels().removeIf(label -> "suite".equals(label.getName())));
        Allure.label("parentSuite", "Web interface (Playwright)");
        Allure.suite("Ajax");
        //this.createContextAndPageForVideo();
        this.page.navigate("http://qa-demo.gitlab.io/reports/web/ajax.html");
        byte[] buffer = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
        Allure.addAttachment("Open page", new ByteArrayInputStream(buffer));
        AjaxPage ajax = new AjaxPage(this.page);
        Response response = page.waitForResponse("**/ajax.txt", () -> {
            ajax.click();;
            final byte[]buffer2 = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
            Allure.addAttachment("Trigger event", new ByteArrayInputStream(buffer2));
        });
        ajax.verify_title();
        buffer = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
        Allure.addAttachment("Verify event result", new ByteArrayInputStream(buffer));
        this.closeContext();
        try {
            Allure.addAttachment("Recorded video", "video/webm", Files.newInputStream(page.video().path()), "webm");
        } catch (IOException e) { }
    }

    /**
     * Testing an AJAX page.
     *
     * Test using <code>assertThat().isAttached()</code>.
     */
    @Test
    @Description(useJavaDoc = true)
    @Link(name = "Target page", url = "https://qa-demo.gitlab.io/reports/web/ajax.html")
    @Issue("JIRA-123")
    @TmsLink("TEST-456")
    @Epic("Web interface (Playwright)")
    @Story("Ajax")
    public void ajax_verification_with_assert() {
        Allure.getLifecycle().updateTestCase(tr -> tr.getLabels().removeIf(label -> "suite".equals(label.getName())));
        Allure.label("parentSuite", "Web interface (Playwright)");
        Allure.suite("Ajax");
        //this.createContextAndPageForVideo();
        this.page.navigate("http://qa-demo.gitlab.io/reports/web/ajax.html");
        byte[] buffer = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
        Allure.addAttachment("Open page", new ByteArrayInputStream(buffer));
        AjaxPage ajax = new AjaxPage(this.page);
        ajax.click();
        buffer = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
        Allure.addAttachment("Trigger event", new ByteArrayInputStream(buffer));
        ajax.wait_event();
        ajax.verify_title();
        buffer = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
        Allure.addAttachment("Verify event result", new ByteArrayInputStream(buffer));
        this.closeContext();
        try {
            Allure.addAttachment("Recorded video", "video/webm", Files.newInputStream(page.video().path()), "webm");
        } catch (IOException e) { }
    }

}
