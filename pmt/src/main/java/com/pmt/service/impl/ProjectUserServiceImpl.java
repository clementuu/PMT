package com.pmt.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pmt.dto.UsersProject;
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
    public List<ProjectUser> addUsersToProject(UsersProject request) {
        Project project = projectStore.findById(request.getProjectId())
                .orElseThrow(() -> new ValidationException("Project not found with ID: " + request.getProjectId()));

        List<ProjectUser> addedProjectUsers = new ArrayList<>();
        for (UsersProject.UserRoleDTO userRoleDTO : request.getUsers()) {
            User user = userStore.findById(userRoleDTO.getUserId())
                .orElseThrow(() -> new ValidationException("User not found with ID: " + userRoleDTO.getUserId()));

            ProjectUser newProjectUser = new ProjectUser();
            newProjectUser.setId(userRoleDTO.getId());
            newProjectUser.setProject(project);
            newProjectUser.setUser(user);
            newProjectUser.setRole(userRoleDTO.getRole());
            addedProjectUsers.add(projectUserStore.save(newProjectUser));
        }
        return addedProjectUsers;
    }

    @Override
    public UsersProject getUsersProjectByProjectId(Long projectId) {
        List<ProjectUser> projectUsers = projectUserStore.findByProjectId(projectId);
        UsersProject usersProjectDTO = new UsersProject();

        if (projectUsers.isEmpty()) {
            usersProjectDTO.setProjectId(projectId); // Still set projectId even if no users
            usersProjectDTO.setUsers(new ArrayList<>());
            return usersProjectDTO;
        }

        // Assuming all projectUsers in the list belong to the same project
        usersProjectDTO.setProjectId(projectUsers.get(0).getProject().getId());

        List<UsersProject.UserRoleDTO> userRoleDTOs = projectUsers.stream()
                .map(pu -> {
                    UsersProject.UserRoleDTO dto = new UsersProject.UserRoleDTO();
                    dto.setId(pu.getId());
                    dto.setUserId(pu.getUser().getId());
                    dto.setRole(pu.getRole());
                    return dto;
                })
                .collect(Collectors.toList());

        usersProjectDTO.setUsers(userRoleDTOs);
        return usersProjectDTO;
    }

    public void deleteById(Long id) {
        projectUserStore.deleteById(id);
    }
}
