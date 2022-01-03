package com.example.backend.repository;

import com.example.backend.model.CreateTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<CreateTask,String> {

    //根据用户名查询
    List<CreateTask> findByTaskOwner(String taskOwner);

    CreateTask findByTaskNameAndTaskOwner(String taskName, String taskOwner);
}
