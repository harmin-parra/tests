package rest_api;

import java.util.Date;
import java.util.Map;

public class CatalogItem {

    String id;
    String name;
    Map<String, Object> data;
    Date createdAt;

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    public void setCreatedAt(Date date) {
        this.createdAt = date;
    }

    public String toString() {
        return "{id=" + this.id + ", name=" + this.name + ", createdAt=" + this.createdAt + ", data=" + this.data.toString() + "}";
    }

}
