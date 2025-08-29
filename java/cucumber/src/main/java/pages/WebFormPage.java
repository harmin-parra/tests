package pages;

import java.nio.file.Paths;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;
import com.microsoft.playwright.Locator;

public class WebFormPage {

    private Page page;
    private Locator input;
    private Locator password;
    private Locator textarea;
    private Locator number;
    private Locator city;
    private Locator file;
    private Locator color;
    private Locator date;
    private Locator range;
    private Locator button;

    public WebFormPage(Page page) {
        this.page = page;
        this.input = page.locator("[id='my-text-id']");
        this.password = page.locator("[name='my-password']");
        this.textarea = page.locator("[name='my-textarea']");
        this.number = page.locator("//select[@name='my-select']");
        this.city = page.locator("//input[@name='my-datalist']");
        this.color = page.locator("[name='my-colors']");
        this.date = page.locator("[name='my-date']");
        this.range = page.locator("[name='my-range']");
        this.file = page.locator("[name='my-file']");
        this.button = page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Submit"));
    }

    public void set_input(String value) {
        this.input.fill(value);
    }

    public void set_password(String value) {
        this.password.fill(value);
    }

    public void set_textarea(String value) {
        this.textarea.fill(value);
    }

    public void set_number(int value) {
        this.number.selectOption(String.valueOf(value));
    }

    public void set_city(String value) {
        this.city.fill(value);
    }

    public void set_file(String value) {
        this.file.setInputFiles(Paths.get(value));
    }

    public void set_color(String value) {
        this.color.fill(value);
    }

    public void set_date(String value) {
        this.date.evaluate("(node, val) => { node.value = val; }", value);
    }

    public void set_range(int value) {
        this.range.fill(String.valueOf(value));
    }

    public void submit() {
        this.button.click();
    }

}
