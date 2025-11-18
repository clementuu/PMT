package com.pmt.service;

import java.util.List;

import com.pmt.model.Project;

public interface ProjectService {
    List<Project> findAll();
    Project findById(Integer id);
    Project create(Project project);
    List<Project> getProjectsByUserId(Long userId);
}
