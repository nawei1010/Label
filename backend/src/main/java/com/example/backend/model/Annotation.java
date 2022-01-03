package com.example.backend.model;

public class Annotation {

    private String id; //图片id
    private String comment; //图片注释
    private double height; //图片画框的高度
    private String type;
    private double width; //图片画框的宽度
    private double x; //图片起始x地址
    private double  y; //图片标注起始y地址
    private String name; //图片名称
    public Annotation(){

    }

    public Annotation(String id, String comment, double height, String type, double width, double x, double y, String name) {
        this.id = id;
        this.comment = comment;
        this.height = height;
        this.type = type;
        this.width = width;
        this.x = x;
        this.y = y;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
