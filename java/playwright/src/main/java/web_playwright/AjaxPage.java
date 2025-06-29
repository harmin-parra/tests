package web_playwright;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.assertions.LocatorAssertions.IsAttachedOptions;
import com.microsoft.playwright.assertions.LocatorAssertions.IsVisibleOptions;
import com.microsoft.playwright.Locator;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class AjaxPage {

    private Page page;
    private Locator button;
    private Locator title;

    public AjaxPage(Page page) {
        this.page = page;
        this.button = page.locator("#button");
        this.title = page.locator("#title");
    }

    public void click() {
        this.button.click();
    }

    public void wait_ajax() {
    	assertThat(this.title).isAttached(new IsAttachedOptions().setTimeout(10000));
    	//assertThat(this.title).isVisible(new IsVisibleOptions().setTimeout(10000));
    }

    public void verify() {
        assertThat(this.title).isVisible();
        assertThat(this.title).hasText("AJAX");
    }

}
