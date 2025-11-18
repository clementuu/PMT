package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pmt.errors.ValidationException;
import com.pmt.model.Project;
import com.pmt.service.ProjectService;
import com.pmt.store.ProjectStore;

@Service
public class ProjectServiceImpl implements ProjectService {
    @Autowired
    ProjectStore projectStore;

    @Override
    public List<Project> findAll() {
        List<Project> projects = new ArrayList<Project>();
        projectStore.findAll().forEach(projects::add);
        
        return projects;
    }

    @Override
    public Project findById(Integer id) {
        return projectStore.findById(id).get();
    }

    @Override
    public Project create(Project project) {
        if(project.getNom() == null || project.getNom().isBlank()) {
            throw new ValidationException("Le projet doit avoir un nom");
        }

        if(project.getDescription() == null || project.getDescription().isBlank()) {
            throw new ValidationException("Le projet doit avoir une description");
        }

        return projectStore.save(project);
    }

    @Override
    public List<Project> getProjectsByUserId(Long userId) {
        return projectStore.findAllByUserId(userId);
    }
}
