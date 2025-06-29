package web_playwright;

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
        this.input = page.getByLabel("Text input");
        this.password = page.getByLabel("Password");
        this.textarea = page.getByLabel("Textarea");
        this.number = page.locator("//select[@name='my-select']");
        this.city = page.locator("//input[@name='my-datalist']");
        this.color = page.getByLabel("Color picker");
        this.date = page.getByLabel("Date picker");
        this.range = page.getByLabel("Example range");
        this.file = page.getByLabel("File input");
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
