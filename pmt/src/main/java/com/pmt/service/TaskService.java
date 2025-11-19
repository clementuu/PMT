package com.pmt.service;

import java.util.List;

import com.pmt.model.Task;

public interface TaskService {
    List<Task> findAll();
    Task findById(Integer id);
    Task create(Task task);
    Task update(Task task);
}
