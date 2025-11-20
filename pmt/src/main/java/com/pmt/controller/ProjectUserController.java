package com.pmt.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pmt.dto.AddUsersProject;
import com.pmt.model.Project;
import com.pmt.model.ProjectUser;
import com.pmt.service.ProjectUserService;

@RestController
@RequestMapping("/project/user")
public class ProjectUserController {
    @Autowired
    ProjectUserService projectUserService;

    @GetMapping("{userId}")
    public ResponseEntity<List<Project>> getProjectsByUserId(@PathVariable Long userId) {
        try{
            List<Project> projets = projectUserService.getProjectsByUserId(userId);
            return ResponseEntity.status(HttpStatus.OK).body(projets);
        } catch (Exception e ) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("")
    public ResponseEntity<?> addUsersToProject(@RequestBody AddUsersProject request) {
        try {
            List<ProjectUser> newProjectUsers = projectUserService.addUsersToProject(request);
            return ResponseEntity.status(HttpStatus.OK).body(newProjectUsers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
