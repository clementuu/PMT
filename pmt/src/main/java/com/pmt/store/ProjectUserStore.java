package com.pmt.store;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.pmt.model.Project;
import com.pmt.model.ProjectUser;
import org.springframework.transaction.annotation.Transactional;

public interface ProjectUserStore extends CrudRepository<ProjectUser, Long> {

    @Query("SELECT pu.project FROM ProjectUser pu WHERE pu.user.id = :userId")

    List<Project> findAllProjectByUserId(@Param("userId") Long userId);
    boolean existsByProjectIdAndUserId(Long projectId, Long userId); // New method
    List<ProjectUser> findByProjectId(Long projectId);
    @Transactional
    void deleteByProjectId(Long projectId);
    @Transactional
    void deleteByUserIdAndProjectId(Long userId, Long projectId);
}
