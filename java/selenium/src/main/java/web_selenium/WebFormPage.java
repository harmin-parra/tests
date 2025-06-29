package web_selenium;

import java.io.File;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Rectangle;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chromium.ChromiumDriver;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.safari.SafariDriver;
import org.openqa.selenium.support.ui.Select;

public class WebFormPage {

    private WebDriver driver;
    private WebElement input;
    private WebElement password;
    private WebElement textarea;
    private Select number;
    private WebElement city;
    private WebElement file;
    private WebElement color;
    private WebElement date;
    private WebElement range;
    private WebElement button;

    public WebFormPage(WebDriver driver) {
        this.driver = driver;
        this.input = driver.findElement(By.name("my-text"));
        this.password = driver.findElement(By.name("my-password"));
        this.textarea = driver.findElement(By.name("my-textarea"));
        this.number = new Select(driver.findElement(By.name("my-select")));
        this.city = driver.findElement(By.name("my-datalist"));
        this.color = driver.findElement(By.name("my-colors"));
        this.date = driver.findElement(By.name("my-date"));
        this.range = driver.findElement(By.name("my-range"));
        if (!(
                driver instanceof FirefoxDriver ||
                driver instanceof ChromeDriver ||
                driver instanceof ChromiumDriver ||
                driver instanceof EdgeDriver ||
                driver instanceof SafariDriver ||
                driver instanceof InternetExplorerDriver        
        ))
            ((RemoteWebDriver) driver).setFileDetector(new LocalFileDetector());
        this.file = driver.findElement(By.name("my-file"));
        //this.button = driver.findElement(By.xpath("//button[@type='submit']"));
        this.button = driver.findElement(By.xpath("//button"));
    }

    public void set_input(String value) {
        this.input.sendKeys(value);
    }

    public void set_password(String value) {
        this.password.sendKeys(value);
    }

    public void set_textarea(String value) {
        this.textarea.sendKeys(value);
    }

    public void set_number(int value) {
        this.number.selectByIndex(value);
    }

    public void set_city(String value) {
        this.city.sendKeys(value);
    }

    public void set_file(String value) {
        File uploadFile = new File(value);
        this.file.sendKeys(uploadFile.getAbsolutePath());
    }

    public void set_color(String value) {
        this.color.sendKeys(value);
    }

    public void set_date(String value) {
        this.date.sendKeys(value);
        // Click elsewhere to close the calendar
        this.driver.findElement(By.xpath("//body")).click();
    }

    public void set_range(int value) {
        /*
        this.range.sendKeys(String.valueOf(value));
        Rectangle dimensions = this.range.getRect();
        int current = Integer.valueOf(range.getAttribute("value"));
        float step = dimensions.width / (Integer.valueOf(this.range.getAttribute("max")) - Integer.valueOf(this.range.getAttribute("min")));
        float offset = (value - current) * step;
        new Actions(this.driver).moveToElement(this.range, (int)offset, 0).perform();
        */
        this.range.sendKeys(String.valueOf(value));
        JavascriptExecutor js = (JavascriptExecutor) driver;  
        js.executeScript("document.getElementsByName('my-range')[0].value = '" + value + "'");
    }

    public void submit() {
        this.button.click();
    }

}
