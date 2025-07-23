package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pmt.model.Task;
import com.pmt.service.TaskService;
import com.pmt.store.TaskStore;

@Service
public class TaskServiceImpl implements TaskService {
    @Autowired
    TaskStore taskStore;

    @Override
    public List<Task> findAll() {
        List<Task> tasks = new ArrayList<Task>();
        taskStore.findAll().forEach(tasks::add);

        return tasks;
    }

}
