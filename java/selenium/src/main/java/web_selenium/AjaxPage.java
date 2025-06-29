package web_selenium;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AjaxPage {

    private WebDriver driver;
    private WebElement title;
    private WebElement button;

    public AjaxPage(WebDriver driver) {
        this.driver = driver;
        this.title = null;
        this.button = this.driver.findElement(By.xpath("//button"));
    }

    public void click() {
        this.button.click();
    }

    public void wait_ajax() {
        Wait<WebDriver> wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(d -> driver.findElement(By.id("title")).isDisplayed());
    	this.title = this.driver.findElement(By.id("title"));
    }

    public void verify() {
    	this.title = this.driver.findElement(By.id("title"));
    	assertTrue(this.title.isDisplayed());
        assertEquals(this.title.getText(), "AJAX");
    }

}
