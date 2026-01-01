package karate;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import com.intuit.karate.junit5.Karate;

import io.qameta.allure.karate.AllureKarate;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class TestRunner {

    @Karate.Test
    public Karate runner() {
        return Karate
                .run("classpath:rest_api", "classpath:web")
                .hook(new AllureKarate())
                .relativeTo(getClass())
                .outputJunitXml(true);
    }

    @Test
    public void webTest() {
        // Results results = Runner.path("classpath:" + getClass().getPackageName().replace('.', '/'))
        Results results = Runner.path("classpath:web/form_page")
                .outputCucumberJson(true)
                .outputJunitXml(true)
                .parallel(1);
        assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }

    @Test
    public void modularityTest() {
        // Results results = Runner.path("classpath:" + getClass().getPackageName().replace('.', '/'))
        Results results = Runner.path("classpath:karate/modularity")
                .outputCucumberJson(true)
                .outputJunitXml(true)
                .parallel(1);
        assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }

}
