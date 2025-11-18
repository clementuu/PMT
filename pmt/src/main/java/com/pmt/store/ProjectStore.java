package com.pmt.store;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.pmt.model.Project;

public interface ProjectStore extends CrudRepository<Project, Integer> {

    @Query("SELECT pu.project FROM ProjectUser pu WHERE pu.user.id = :userId")
    List<Project> findAllByUserId(@Param("userId") Long userId);
}
