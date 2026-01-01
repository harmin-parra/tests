package rest_api;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import com.intuit.karate.junit5.Karate;

import io.qameta.allure.karate.AllureKarate;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class TestRunner {

    /*
    @Test
    public void allTests() {
        Results results = Runner.path("classpath:" + getClass().getPackageName().replace('.', '/'))
                .outputCucumberJson(true)
                .hook(new AllureKarate())
                .outputJunitXml(true)
                .parallel(1);
        assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }
    */
    
    @Karate.Test
    public Karate runner() {
        return Karate
                .run("classpath:rest_api")
                .hook(new AllureKarate())
                .relativeTo(getClass())
                .outputJunitXml(true);
    }

}
