package rest_api;

import io.qameta.allure.Allure;
import io.qameta.allure.restassured.AllureRestAssured;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class CatalogTest {

    static String id = null;


    @BeforeAll
    public static void setUp() {
        RestAssured.baseURI = "https://api.restful-api.dev";
        RestAssured.basePath = "/objects";
        RestAssured.requestSpecification = 
            (RequestSpecification) new RequestSpecBuilder()
                .setContentType(ContentType.JSON)
                .setAccept(ContentType.JSON)
                .build();  //.log().all();  //log().uri().log().method();
    }

    @Test
    @Order(1)
    public void add_object() {
        Allure.getLifecycle().updateTestCase(tr -> tr.getLabels().removeIf(label -> "suite".equals(label.getName())));
        Allure.feature("REST api (rest-assured)");
        Allure.story("Catalogue");
        Allure.suite("REST api (rest-assured)");

        Map<String, Object> data = new HashMap<String, Object>();
        data.put("year", 2019);
        data.put("price", 1849.99);
        data.put("CPU model", "Intel Core i9");
        data.put("Hard disk size", "1 TB");
        Map<String, Object> payload = new HashMap<String, Object>();
        payload.put("name", "Lenovo notebook");
        payload.put("data", data);

        Response response =
        given().
            filter(new AllureRestAssured()).
            body(payload).
            //contentType("application/json").
            //log().all().
        when().
            post("").
        then().
            log().all().
            statusCode(200).
            body("name", equalTo("Lenovo notebook")).
        extract().response();
        JsonPath body = response.jsonPath();
        String id = (String) body.get("id");
        //try {
        //    Files.writeString(Paths.get("shared.txt"), id);
        //} catch (IOException e) { }
        SharedData.id = id;

        CatalogItem item = response.as(CatalogItem.class);
    }

    @Test
    @Order(2)
    public void get_object() {
        Allure.getLifecycle().updateTestCase(tr -> tr.getLabels().removeIf(label -> "suite".equals(label.getName())));
        Allure.feature("REST api (rest-assured)");
        Allure.story("Catalogue");
        Allure.suite("REST api (rest-assured)");

        String id = null;
        //try {
        //    id = Files.readString(Paths.get("shared.txt"));
        //} catch (IOException e) { }
        id = SharedData.id;
        Response response =
        with().
            filter(new AllureRestAssured()).
        when().
            get("/{id}", id).
        then().
            log().all().
            statusCode(200).
            body("id", equalTo(id)).
            body("name", equalTo("Lenovo notebook")).
        extract().response();

        CatalogItem item = response.as(CatalogItem.class);
    }

    @Test
    @Order(3)
    public void delete_object() {
        Allure.getLifecycle().updateTestCase(tr -> tr.getLabels().removeIf(label -> "suite".equals(label.getName())));
        Allure.feature("REST api (rest-assured)");
        Allure.story("Catalogue");
        Allure.suite("REST api (rest-assured)");

        String id = null;
        //try {
        //    id = Files.readString(Paths.get("shared.txt"));
        //} catch (IOException e) { }
        id = SharedData.id;
        // Delete pet
        with().
            filter(new AllureRestAssured()).
        when().
            delete("/{id}", id).
        then().
            log().all().
            statusCode(200).
            body("message", equalTo("Object with id = " + id + " has been deleted."));

        // Get deleted pet
        with().
            filter(new AllureRestAssured()).
        when().
            get("/{id}", id).
        then().
            log().all().
            statusCode(404).
            body("error", equalTo("Oject with id=" + id + " was not found."));
    }

}

class SharedData {
    public static String id;
}