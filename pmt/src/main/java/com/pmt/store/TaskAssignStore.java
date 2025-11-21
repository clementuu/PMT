package com.pmt.store;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import com.pmt.model.TaskAssign;

public interface TaskAssignStore extends CrudRepository<TaskAssign, Long> {
    @Transactional
    void deleteByProjectId(Long projectId);
}
