package steps;

import io.cucumber.java.After;
import io.cucumber.java.Before;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.BrowserType.LaunchOptions;

import java.nio.file.Paths;
import org.apache.commons.lang3.StringUtils;

public abstract class BaseSteps {

    private Playwright playwright;
    protected Browser browser = this.getBrowser();
    protected BrowserContext context;
    protected Page page;

    private Browser getBrowser() {
        String browserName = StringUtils.isEmpty(System.getProperty("browser")) ? "firefox"
                : System.getProperty("browser").toLowerCase();
        boolean headless = StringUtils.isEmpty(System.getProperty("headless")) ? true
                : Boolean.parseBoolean(System.getProperty("headless").toLowerCase());
        playwright = Playwright.create();
        LaunchOptions options = new BrowserType.LaunchOptions().setHeadless(headless);
        if (browserName.equals("chromium"))
            browser = playwright.chromium().launch(options);
        else if (browserName.equals("firefox"))
            browser = playwright.firefox().launch(options);
        else if (browserName.equals("webkit"))
            browser = playwright.webkit().launch(options);
        else if (browserName.equals("chrome") || browserName.equals("msedge"))
            browser = playwright.chromium().launch(options.setChannel(browserName));
        return browser;
    }

}
