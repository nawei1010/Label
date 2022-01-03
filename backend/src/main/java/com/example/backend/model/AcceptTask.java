package com.example.backend.model;

import javax.persistence.*;

@Entity
@Table(name = "acceptTask")
public class AcceptTask {
      @Id
      @GeneratedValue(strategy =  GenerationType.IDENTITY)
      private int id;

      @Column(name = "taskName")
      private String taskName;

      @Column(name = "acceptUser")
      private String acceptUser;

      @Column(name = "acceptOwner")
      private String acceptOwner;

      public AcceptTask(){

      }

      public AcceptTask(String taskName, String acceptUser, String acceptOwner) {
        this.taskName = taskName;
        this.acceptUser = acceptUser;
        this.acceptOwner = acceptOwner;
      }

      public String getTaskName() {
          return taskName;
      }

      public void setTaskName(String taskName) {
          this.taskName = taskName;
      }

      public String getAcceptUser() {
          return acceptUser;
      }

      public void setAcceptUser(String acceptUser) {
          this.acceptUser = acceptUser;
      }

      public String getAcceptOwner() {
        return acceptOwner;
      }

      public void setAcceptOwner(String acceptOwner) {
        this.acceptOwner = acceptOwner;
      }
}
