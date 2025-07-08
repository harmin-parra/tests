package demo.pages;

import net.serenitybdd.annotations.DefaultUrl;
import net.serenitybdd.core.pages.PageObject;
import net.serenitybdd.core.pages.WebElementFacade;
import org.openqa.selenium.By;
import org.junit.jupiter.api.Assertions;

public class WebFormPage extends PageObject {

    public static final By login = By.name("my-text");
    public static final By password = By.name("my-password");
    public static final By textarea = By.name("my-textarea");
    public static final By number = By.name("my-select");
    public static final By city = By.name("my-datalist");
    public static final By color = By.name("my-colors");
    public static final By date = By.name("my-date");
    public static final By range = By.name("my-range");
    public static final By file = By.name("my-file");
    public static final By button = By.xpath("//button");


    public void openPage() {
        openUrl("https://www.selenium.dev/selenium/web/web-form.html");
        Assertions.assertTrue(find(By.xpath("//h1")).getText().equals("Web form"), "Asserting H1 text");
    }

    public void toTheWebFormPage() {
        openUrl("https://www.selenium.dev/selenium/web/web-form.html");
    }

    public void setLogin(String var) {
        find(WebFormPage.login).sendKeys(var);
    }

    public void setPassword(String var) {
        find(WebFormPage.password).sendKeys(var);
    }

    public void setTextarea(String var) {
        find(WebFormPage.textarea).sendKeys(var);
    }

    public void setNumber(int var) {
        find(WebFormPage.number).selectByIndex(var);
    }

    public void setCity(String var) {
        find(WebFormPage.city).sendKeys(var);
    }

    public void setFile(String var) {
        WebElementFacade elem = $(By.name("my-file"));
        upload(var).to(elem);
        //find(this.file).sendKeys(var);
        //evaluateJavascript("document.getElementsByName('my-colors')[0].value = '" + var + "'");
    }

    public void setColor(String var) {
        find(WebFormPage.color).sendKeys(var);
    }

    public void setDate(String var) {
        find(WebFormPage.date).sendKeys(var);
        find(By.xpath("//body")).click();
    }

    public void setRange(int var) {
        evaluateJavascript("document.getElementsByName('my-range')[0].value = '" + String.valueOf(var) + "'");
    }

    public void submit() {
        find(WebFormPage.button).click();
    }

    public void verify_submit() {
        Assertions.assertTrue(find(By.xpath("//h1")).getText().equals("Form submitted"), "Asserting H1 text");
    }
}
