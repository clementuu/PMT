package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pmt.dto.AddUsersProject;
import com.pmt.errors.ValidationException;
import com.pmt.model.Project;
import com.pmt.model.ProjectUser;
import com.pmt.model.User;
import com.pmt.service.ProjectUserService;
import com.pmt.store.ProjectStore;
import com.pmt.store.ProjectUserStore;
import com.pmt.store.UserStore;

@Service
public class ProjectUserServiceImpl implements ProjectUserService {
    @Autowired
    ProjectUserStore projectUserStore;
    @Autowired
    ProjectStore projectStore;
    @Autowired
    UserStore userStore;

    @Override
    public List<Project> getProjectsByUserId(Long userId) {
        return projectUserStore.findAllProjectByUserId(userId);
    }

    @Override
    public List<ProjectUser> addUsersToProject(AddUsersProject request) {
        Project project = projectStore.findById(request.getProjectId())
                .orElseThrow(() -> new ValidationException("Project not found with ID: " + request.getProjectId()));

        List<ProjectUser> addedProjectUsers = new ArrayList<>();
        for (AddUsersProject.UserRoleDTO userRoleDTO : request.getUsers()) {
            User user = userStore.findById(userRoleDTO.getUserId())
                    .orElseThrow(() -> new ValidationException("User not found with ID: " + userRoleDTO.getUserId()));

            if (!projectUserStore.existsByProjectIdAndUserId(project.getId(), user.getId())) {
                ProjectUser newProjectUser = new ProjectUser();
                newProjectUser.setProject(project);
                newProjectUser.setUser(user);
                newProjectUser.setRole(userRoleDTO.getRole());
                addedProjectUsers.add(projectUserStore.save(newProjectUser));
            } else {
                System.out.println("User " + user.getId() + " is already part of project " + project.getId());
            }
        }
        return addedProjectUsers;
    }
}

