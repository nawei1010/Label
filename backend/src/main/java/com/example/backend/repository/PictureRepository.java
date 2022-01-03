package com.example.backend.repository;

import com.example.backend.model.Picture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PictureRepository extends JpaRepository<Picture, String> {

    //根据创建者查询
    List<Picture> findByOwner(String user);
}
