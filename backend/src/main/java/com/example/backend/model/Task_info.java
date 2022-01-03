package com.example.backend.model;

import javax.persistence.*;

@Entity
@Table(name = "taskinfo")
public class Task_info {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "imageUrl")
    private String imageUrl;

    @Column(name = "taskName")
    private String taskName;

    @Column(name = "imageOwner")
    private String imageOwner;

    public Task_info(){

    }

    public Task_info(String imageUrl, String taskName, String imageOwner){
        this.imageUrl = imageUrl;
        this.taskName = taskName;
        this.imageOwner = imageOwner;
    }

    public int getId() {
        return id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getImageOwner() {
        return imageOwner;
    }

    public void setImageOwner(String imageOwner) {
        this.imageOwner = imageOwner;
    }
}
