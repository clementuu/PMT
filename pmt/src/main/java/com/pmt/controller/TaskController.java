package com.pmt.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pmt.errors.ValidationException;
import com.pmt.model.Task;
import com.pmt.service.TaskService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/task")
public class TaskController {
    @Autowired
    TaskService taskService;

    @GetMapping("")  
    public ResponseEntity<List<Task>> getAll() {
        try {
            List<Task> tasks = taskService.findAll();
            return ResponseEntity.status(HttpStatus.OK).body(tasks);
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Integer id) {
        try {
            Task task = taskService.findById(id);
            return ResponseEntity.status(HttpStatus.OK).body(task);
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    

    @PostMapping("")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        try {
            Task createdTask = taskService.create(task);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("")
    public ResponseEntity<Task> putTask(@RequestBody Task task) {
        try {
            Task patchedTask = taskService.update(task); // Changed to update
            return ResponseEntity.status(HttpStatus.OK).body(patchedTask);
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
