package com.pmt.service;

import java.util.List;

import com.pmt.dto.TaskDTO;
import com.pmt.model.Task;

public interface TaskService {
    List<TaskDTO> findAll();
    TaskDTO findById(Long id);
    Task create(TaskDTO dto);
    TaskDTO update(TaskDTO task);
    void deleteById(Long taskId);
}
