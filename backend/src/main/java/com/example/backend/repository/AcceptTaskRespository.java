package com.example.backend.repository;

import com.example.backend.model.AcceptTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcceptTaskRespository extends JpaRepository<AcceptTask, Integer> {
     //根据接受任务的人来查询任务
     List<AcceptTask> findByAcceptUser(String acceptUser);

     //根据任务名来查询任务
     List<AcceptTask> findByTaskName(String taskName);

     AcceptTask findByAcceptUserAndTaskNameAndAcceptOwner(String acceptUser, String taskName,String owner);
}
