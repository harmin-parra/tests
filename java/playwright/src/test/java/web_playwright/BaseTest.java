package web_playwright;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;

import java.nio.file.Paths;

import org.apache.commons.lang3.StringUtils;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.BrowserType.LaunchOptions;

abstract class BaseTest {

    static protected Playwright playwright;
    static protected Browser browser;
    protected BrowserContext context;
    protected Page page;

    @BeforeAll
    public static void launchBrowser() {
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
    }

    //@BeforeEach
    public void createContextAndPage() {
        this.context = browser.newContext();
        this.page = context.newPage();
    }

    @AfterAll
    public static void closeBrowser() {
        playwright.close();
    }

    @AfterEach
    public void closeContext() {
        this.context.close();
    }

    @BeforeEach
    public void createContextAndPageForVideo() {
        this.context = browser.newContext(new Browser.NewContextOptions().setRecordVideoDir(Paths.get("target/videos/")));
        this.page = context.newPage();
    }
}
