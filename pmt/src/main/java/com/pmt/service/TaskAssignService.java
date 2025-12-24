package com.pmt.service;

import java.util.List;

import com.pmt.model.TaskAssign;
import com.pmt.model.User;

public interface TaskAssignService {
    TaskAssign create(Long taskId, Long userId);
    List<User> getUsersByTaskId(Long taskId);
    void deleteByTaskId(Long id);
}
