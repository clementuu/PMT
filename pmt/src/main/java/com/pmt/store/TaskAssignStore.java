package com.pmt.store;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import com.pmt.model.TaskAssign;
import java.util.List;


public interface TaskAssignStore extends CrudRepository<TaskAssign, Long> {
    @Transactional
    void deleteByTaskId(Long taskId);
    List<TaskAssign> findByTaskId(Long taskId);
}
