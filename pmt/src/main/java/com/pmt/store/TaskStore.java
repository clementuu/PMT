package com.pmt.store;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.pmt.model.Task;
import org.springframework.transaction.annotation.Transactional;

public interface TaskStore extends CrudRepository<Task, Long> {
    @Transactional
    void deleteByProjectId(Long projectId);
    List<Task> findByProjectId(Long projectId);
}
