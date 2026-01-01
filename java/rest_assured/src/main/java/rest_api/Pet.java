package rest_api;

import java.util.List;
import java.util.Map;

public class Pet {

    long id;
    Map<String, Object> category;
    String name;
    List<String> photoUrls;
    List<Map<String, Object>> tags;
    String status;
    
    public void setId(long id) {
        this.id = id;
    }
    
    public void setCategory(Map<String, Object> category) {
        this.category = category;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public void setTags(List<Map<String, Object>> tags) {
        this.tags = tags;
    }
    
    public void setPhotoUrls(List<String> photos) {
        this.photoUrls = photos;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
