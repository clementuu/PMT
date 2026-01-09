package com.pmt.service;

import java.util.List;

import com.pmt.dto.ProjectUpdate;
import com.pmt.model.Project;

public interface ProjectService {
    List<Project> findAll();
    Project findById(Long id);
    Project create(Project project);
    Project update(ProjectUpdate project);
    void deleteProject(Long id);
}
