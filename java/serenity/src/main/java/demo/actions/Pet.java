package demo.actions;

public class Pet {
    private String name;
    private String status;
    private int id;

    public Pet(String name, String status, int id) {
        this.name = name;
        this.status = status;
        this.id = id;
    }

    public Pet(String name, String status) {
        this.name = name;
        this.status = status;
    }

    public String getName() {
        return this.name;
    }

    public String getStatus() {
        return this.status;
    }

    public int getId() {
        return id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setId(int id) {
        this.id = id;
    }
}