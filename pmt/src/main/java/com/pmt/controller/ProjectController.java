package com.pmt.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pmt.model.Project;
import com.pmt.service.ProjectService;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/project")
public class ProjectController {
    @Autowired
    ProjectService projectService;

    @GetMapping("")
    public List<Project> getAll() {
        return projectService.findAll();
    }
    
}
