package com.pmt.service;

import java.util.List;

import com.pmt.model.TaskAssign;
import com.pmt.model.User;

public interface TaskAssignService {
    TaskAssign create(TaskAssign taskAssign);
    List<User> getUsersByTaskId(Long taskId);
    void deleteByProjectId(Long id);
}
