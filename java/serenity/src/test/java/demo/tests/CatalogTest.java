package demo.tests;

import net.serenitybdd.junit5.SerenityJUnit5Extension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import demo.actions.CatalogActions;
import demo.actions.CatalogObject;

@ExtendWith(SerenityJUnit5Extension.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class CatalogTest {

    static String id;
    CatalogActions catalogApi;

    @Test
    @Order(1)
    public void addObject() {
        catalogApi.givenCatalogExists();
        CatalogObject obj = catalogApi.whenIAddObject("Lenovo notebook", 2019, (float)1849.99, "Intel Core i9", "1 TB");
        catalogApi.thenObjectIsAdded(obj.id, obj);
        id = obj.id;
    }

    @Test
    @Order(2)
    public void getObject() {
        catalogApi.givenObjectExists();
        CatalogObject obj = catalogApi.whenIGetObject(id);
        catalogApi.thenIGetObjectInfo(id, obj);
    }

    @Test
    @Order(3)
    public void deleteObject() {
        catalogApi.givenObjectExists();
        catalogApi.whenIDeleteObject(id);
        catalogApi.thenObjectIsDeleted(id);
    }
}

class SharedData {
    public static String id;
}
