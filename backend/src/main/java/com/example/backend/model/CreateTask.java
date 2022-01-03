package com.example.backend.model;

import javax.persistence.*;

@Entity
@Table(name = "createTask")
public class CreateTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "createTime")
    private String createTime;

    @Column(name = "taskName")
    private String taskName;

    @Column(name = "Owner")
    private String taskOwner;

    public CreateTask(){

    }

    public CreateTask(String createTime, String taskName, String taskOwner) {
        this.createTime = createTime;
        this.taskName = taskName;
        this.taskOwner = taskOwner;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getTaskOwner() {
        return taskOwner;
    }

    public void setTaskOwner(String taskOwner) {
        this.taskOwner = taskOwner;
    }
}
