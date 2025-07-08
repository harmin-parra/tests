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
import org.junit.jupiter.api.Assertions;
import static net.serenitybdd.rest.SerenityRest.*;

public class PetstoreActions extends UIInteractions {

    private static Pet pet = null;

    @Given("I have a pet store")
    public void givenPetstoreExits() { }

    @Given("A pet exists in the store")
    public void givenPetExists() {
        Assertions.assertNotNull(PetstoreActions.pet);
    }

    @When("I add a pet")
    public Pet whenIAddPet() {
        Map<String, Object> payload = new HashMap<String, Object>();
        payload.put("id", 543);
        payload.put("name", "Cookie");
        payload.put("status", "sold");

        PetstoreActions.pet = given()
            .baseUri("https://petstore.swagger.io")
            .basePath("/v2/pet")
            .body(payload)
            .accept(ContentType.JSON)
            .contentType(ContentType.JSON).post().getBody().as(Pet.class, ObjectMapperType.GSON);
        return PetstoreActions.pet;
    }

    @When("I query an existing pet")
    public Pet whenIGetPet() {
        return when().get("/" + PetstoreActions.pet.getId()).getBody().as(Pet.class, ObjectMapperType.GSON);
    }

    @Then("The pet is added")
    public void thenPetIsAdded() {
        Assertions.assertNotNull(PetstoreActions.pet);
        given()
            .baseUri("https://petstore.swagger.io")
            .basePath("/v2/pet")
        .when()
            .get("/" + PetstoreActions.pet.getId())
        .then()
            .body("id", Matchers.equalTo(PetstoreActions.pet.getId()));
    }

    @Then("I get the pet information")
    public void thenIGetPetInfo() {
        then().body("id", Matchers.equalTo(PetstoreActions.pet.getId()));
    }

    @When("I delete a pet")
    public void whenIDeletePet() {
        given()
            .baseUri("https://petstore.swagger.io")
            .basePath("/v2/pet")
            .accept(ContentType.JSON)
            .contentType(ContentType.JSON)
            .delete("/" + PetstoreActions.pet.getId())
        .then()
            .body("message", Matchers.equalTo(String.valueOf(PetstoreActions.pet.getId())));
    }

    @Then("The pet is deleted")
    public void thenPetIsDeleted() {
        when()
            .get("/" + PetstoreActions.pet.getId())
        .then()
            .body("message", Matchers.equalTo("Pet not found"));
    }

}
