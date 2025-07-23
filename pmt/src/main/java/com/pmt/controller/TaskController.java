package com.pmt.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pmt.model.Task;
import com.pmt.service.TaskService;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/task")
public class TaskController {
    @Autowired
    TaskService taskService;

    @GetMapping("")  
    public List<Task> getAll() {
        return taskService.findAll();
    }
}
