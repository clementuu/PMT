package com.pmt.service;

import com.pmt.model.TaskAssign;

public interface TaskAssignService {
    TaskAssign create(TaskAssign taskAssign);
    void deleteByProjectId(Long id);
}
