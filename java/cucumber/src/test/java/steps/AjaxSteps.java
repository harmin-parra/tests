package steps;

import pages.AjaxPage;
import steps.BaseSteps;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import java.nio.file.Paths;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Page;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class AjaxSteps extends BaseSteps {

    private AjaxPage ajax;

    @Before
    public void createContextAndPageForVideo() {
        this.context = browser.newContext(new Browser.NewContextOptions().setRecordVideoDir(Paths.get("target/videos/")));
        this.page = context.newPage();
    }


    @After
    public void closeContext() {
        this.context.close();
    }

}
