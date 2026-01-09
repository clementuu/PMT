package com.pmt.service;

import java.util.List;

import com.pmt.dto.Assigned;
import com.pmt.model.TaskAssign;

public interface TaskAssignService {
    TaskAssign create(Long taskId, Long userId);
    List<Assigned> getUsersByTaskId(Long taskId);
    void deleteByTaskId(Long id);
    void deleteById(Long id);
}
