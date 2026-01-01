package steps;

import pages.WebFormPage;
import steps.BaseSteps;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import org.apache.commons.io.FileUtils;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Page;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import io.qameta.allure.Allure;

public class WebFormSteps extends BaseSteps {

    private WebFormPage webform;

    @Before
    public void createContextAndPageForVideo() {
        this.context = browser.newContext(new Browser.NewContextOptions().setRecordVideoDir(Paths.get("target/videos/")));
        this.page = context.newPage();
    }

    @Given("The form is empty")
    public void display_form() {
        this.page.navigate("https://www.selenium.dev/selenium/web/web-form.html");
        this.webform = new WebFormPage(page);
        try{ Thread.sleep(1500); } catch(Exception e) { }
        byte[] buffer = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
        Allure.addAttachment("Empty form", new ByteArrayInputStream(buffer));
    }

    @When("I fill out the form")
    public void fill_out_form() {
        this.webform.set_input("login");
        this.webform.set_password("password");
        this.webform.set_textarea("textarea");
        this.webform.set_number(2);
        this.webform.set_city("Los Angeles");
        this.webform.set_file("src/test/resources/file.xml");
        this.webform.set_color("#00ff00");
        this.webform.set_date("01/01/2024");
        this.webform.set_range(1);
        try{ Thread.sleep(1500); } catch(Exception e) { }
        byte[] buffer = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
        Allure.addAttachment("Complete form", new ByteArrayInputStream(buffer));
        try {
            Allure.addAttachment("File to upload", "application/xml", FileUtils.readFileToString(new File("src/test/resources/file.xml"), "UTF-8"), ".xml");
        } catch (IOException e) { }
    }

    @When("I click Submit")
    public void click_submit() {
        this.webform.submit();
    }

    @Then("The form is submitted")
    public void form_submitted() {
        try{ Thread.sleep(1500); } catch(Exception e) { }
        byte[] buffer = page.screenshot(new Page.ScreenshotOptions().setFullPage(true));
        Allure.addAttachment("Submit form", new ByteArrayInputStream(buffer));
        assertThat(this.page.locator("//h1")).hasText("Form submitted");
    }

    @After
    public void closeContext() {
        this.context.close();
    }

}
