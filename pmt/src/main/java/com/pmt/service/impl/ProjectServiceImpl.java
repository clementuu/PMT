package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}
