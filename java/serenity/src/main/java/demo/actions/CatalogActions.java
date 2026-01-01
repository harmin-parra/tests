package demo.actions;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.mapper.ObjectMapperType;
import net.serenitybdd.core.steps.UIInteractions;
import org.hamcrest.Matchers;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import org.junit.jupiter.api.Assertions;
import static net.serenitybdd.rest.SerenityRest.*;
import static org.hamcrest.MatcherAssert.assertThat;

public class CatalogActions extends UIInteractions {

    @Given("A catalog exists in the store")
    public void givenCatalogExists() {
        return;
    }

    @Given("An object exists in the catalog")
    public void givenObjectExists() {
        return;
    }

    @When("I add a object")
    public CatalogObject whenIAddObject(String name, int year, float price, String cpu, String disk) {
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("year", year);
        data.put("price", price);
        data.put("CPU model", cpu);
        data.put("Hard disk size", disk);
        Map<String, Object> payload = new HashMap<String, Object>();
        payload.put("name", "Lenovo notebook");
        payload.put("data", data);

        CatalogObject obj = given()
            .baseUri("https://api.restful-api.dev")
            .basePath("/objects")
            .body(payload)
            .accept(ContentType.JSON)
            .contentType(ContentType.JSON).post().getBody().as(CatalogObject.class, ObjectMapperType.GSON);  //.body().path("id");
        return obj;
    }

    @When("I query an existing object")
    public CatalogObject whenIGetObject(String id) {
        Assertions.assertNotNull(id);
        return when().get("/" + id).getBody().as(CatalogObject.class, ObjectMapperType.GSON);  // .body().path("id");
    }

    @Then("The object is added")
    public void thenObjectIsAdded(String id, CatalogObject obj) {
        Assertions.assertNotNull(id);
        CatalogObject obj2 = given()
            .baseUri("https://api.restful-api.dev")
            .basePath("/objects")
        .when()
            .get("/" + id)
            .getBody().as(CatalogObject.class, ObjectMapperType.GSON);
        Assertions.assertEquals(obj.id, obj2.id);
        Assertions.assertEquals(obj.name, obj2.name);
        Assertions.assertEquals(obj.data.year, obj2.data.year);
    }

    @Then("I get the object information")
    public void thenIGetObjectInfo(String id, CatalogObject obj) {
        then().body("id", Matchers.equalTo(obj.id));
    }

    @When("I delete an object")
    public void whenIDeleteObject(String id) {
        given()
        .baseUri("https://api.restful-api.dev")
        .basePath("/objects")
            .accept(ContentType.JSON)
            .contentType(ContentType.JSON)
            .delete("/" + id)
        .then()
            .body("message", Matchers.equalTo("Object with id = " + id + " has been deleted."));
    }

    @Then("The object is deleted")
    public void thenObjectIsDeleted(String id) {
        when()
            .get("/" + id)
        .then()
            .body("error", Matchers.equalTo("Oject with id=" + id + " was not found."));
    }

}
