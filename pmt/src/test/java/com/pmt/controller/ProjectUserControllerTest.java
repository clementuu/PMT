package com.pmt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pmt.config.TestBeansConfig;
import com.pmt.dto.UsersProject;
import com.pmt.errors.ValidationException;
import com.pmt.model.Project;
import com.pmt.model.ProjectUser;
import com.pmt.model.Role;
import com.pmt.model.User;
import com.pmt.service.ProjectUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProjectUserController.class)
@Import(TestBeansConfig.class)
class ProjectUserControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectUserService projectUserService;

    @Autowired
    private ObjectMapper objectMapper;

    private Project project;
    private User user;
    private ProjectUser projectUser;
    private UsersProject usersProject;

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setId(1L);
        project.setNom("Test Project");

        user = new User();
        user.setId(10L);
        user.setNom("Test User");

        projectUser = new ProjectUser();
        projectUser.setId(100L);
        projectUser.setProject(project);
        projectUser.setUser(user);
        projectUser.setRole(Role.MEMBER);

        UsersProject.UserRoleDTO userRoleDTO = new UsersProject.UserRoleDTO();
        userRoleDTO.setUserId(10L);
        userRoleDTO.setRole(Role.MEMBER);

        usersProject = new UsersProject();
        usersProject.setProjectId(1L);
        usersProject.setUsers(Collections.singletonList(userRoleDTO));
    }

    @Test
    void testGetProjectsByUserId_Success() throws Exception {
        when(projectUserService.getProjectsByUserId(10L)).thenReturn(Collections.singletonList(project));

        mockMvc.perform(get("/project/user/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nom").value("Test Project"));
    }

    @Test
    void testAddUsersToProject_Success() throws Exception {
        when(projectUserService.addUsersToProject(any(UsersProject.class))).thenReturn(Collections.singletonList(projectUser));

        mockMvc.perform(post("/project/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usersProject)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$[0].id").value(100L));
    }

    @Test
    void testAddUsersToProject_ValidationException() throws Exception {
        when(projectUserService.addUsersToProject(any(UsersProject.class))).thenThrow(new ValidationException("Project not found"));

        mockMvc.perform(post("/project/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usersProject)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Project not found"));
    }

    @Test
    void testGetUsersByProjectId_Success() throws Exception {
        when(projectUserService.getUsersProjectByProjectId(1L)).thenReturn(usersProject);

        mockMvc.perform(get("/project/user/list/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projectId").value(1L))
                .andExpect(jsonPath("$.users[0].userId").value(10L));
    }
    
    @Test
    void testDeleteById_Success() throws Exception {
        doNothing().when(projectUserService).deleteById(100L);

        mockMvc.perform(delete("/project/user/100"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteById_Exception() throws Exception {
        doThrow(new RuntimeException("Internal Error")).when(projectUserService).deleteById(100L);

        mockMvc.perform(delete("/project/user/100"))
                .andExpect(status().isInternalServerError());
    }
}
