package com.example.backend.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "picture")
public class Picture {
    @Id
    @Column(name = "pictureUrl")
    private String pictureUrl;

    @Column(name = "owner")
    private  String owner;

    public Picture(){

    }

    public Picture(String pictureUrl, String owner) {
        this.pictureUrl = pictureUrl;
        this.owner = owner;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }
}
