package com.example.backend.repository;

import com.example.backend.model.Task_info;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskInfoRepostiory extends JpaRepository<Task_info, Integer> {

    //根据任务名查询
    List<Task_info> findByTaskNameAndImageOwner(String taskName, String imageOwner);
}
