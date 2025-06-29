package starter.acceptancetests;

import java.io.IOException;
import java.nio.file.Paths;
import net.serenitybdd.annotations.Steps;
import net.serenitybdd.core.Serenity;
import net.serenitybdd.junit5.SerenityJUnit5Extension;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import starter.steps.WebFormSteps;

@ExtendWith(SerenityJUnit5Extension.class)
class TestWebForm {

    @Steps
    WebFormSteps webform;

    @Test
    @DisplayName("Fill in form")
    void fillInWebForm() {
        webform.openPage();
        webform.fill("login", "password", "My textarea", 2, "Los Angeles", "file.xml", "#00ff00", "01/01/2024", 1);
        webform.submit();
    }
}
