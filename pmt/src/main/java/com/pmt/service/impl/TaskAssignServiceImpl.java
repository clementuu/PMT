package com.pmt.service.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.pmt.errors.ValidationException;
import com.pmt.model.TaskAssign;
import com.pmt.service.TaskAssignService;
import com.pmt.store.TaskAssignStore;

public class TaskAssignServiceImpl implements TaskAssignService {
    @Autowired
    TaskAssignStore taskAssignStore;

    @Override
    public TaskAssign create(TaskAssign taskAssign) {
        return taskAssignStore.save(taskAssign);
    }

    @Override
    public void deleteByProjectId(Long id) {
        if(id == null) {
            throw new ValidationException("l'id ne peut pas être null");
        }
        taskAssignStore.deleteByProjectId(id);
    }
}
