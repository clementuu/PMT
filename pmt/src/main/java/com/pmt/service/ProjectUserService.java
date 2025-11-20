package com.pmt.service;

import java.util.List;

import com.pmt.dto.AddUsersProject;
import com.pmt.model.Project;
import com.pmt.model.ProjectUser;

public interface ProjectUserService {
    List<Project> getProjectsByUserId(Long userId);
    List<ProjectUser> addUsersToProject(AddUsersProject request);
}
