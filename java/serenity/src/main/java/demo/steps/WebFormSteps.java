package demo.steps;

import net.serenitybdd.annotations.Step;
import net.serenitybdd.core.steps.UIInteractionSteps;
import demo.pages.WebFormPage;
import java.io.IOException;
import java.nio.file.Paths;
import net.serenitybdd.annotations.Steps;
import net.serenitybdd.core.Serenity;

public class WebFormSteps extends UIInteractionSteps {

    WebFormPage webform;

    @Step("Empty form")
    public void openPage() {
        webform.openPage();
    }

    @Step("Complete form")
    public void fill(
        String login,
        String password,
        String text,
        int number,
        String city,
        String file,
        String color,
        String date,
        int range
    ) {
        webform.setLogin(login);
        webform.setPassword(password);
        webform.setTextarea(text);
        webform.setNumber(number);
        webform.setCity(city);
        webform.setFile(file);
        webform.setColor(color);
        webform.setDate(date);
        webform.setRange(range);
    }

    @Step("Submit form")
    public void submit() {
        webform.submit();
        webform.verify_submit();
    }

}
