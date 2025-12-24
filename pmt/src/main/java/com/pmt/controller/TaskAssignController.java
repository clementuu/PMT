package com.pmt.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pmt.model.TaskAssign;
import com.pmt.model.User;
import com.pmt.service.TaskAssignService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/assign")
public class TaskAssignController {
    @Autowired
    TaskAssignService taskAssignService;

    @PostMapping("/{taskId}/{userId}")
    public ResponseEntity<?> postTaskAssign(@PathVariable Long taskId, @PathVariable Long userId) {
        try {
            TaskAssign newTaskAssign = taskAssignService.create(taskId, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(newTaskAssign); 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("{taskId}")
    public ResponseEntity<?> getUsersByTaskId(@PathVariable Long taskId) {
        try {
            List<User> users = taskAssignService.getUsersByTaskId(taskId);
            return ResponseEntity.status(HttpStatus.OK).body(users); 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
    
}
