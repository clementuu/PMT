package com.pmt.service;

import java.util.List;

import com.pmt.model.Project;

public interface ProjectService {
    List<Project> findAll();
    Project create(Project project);
}
