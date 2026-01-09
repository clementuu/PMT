package com.pmt.service.impl;

import com.pmt.dto.UsersProject;
import com.pmt.errors.ValidationException;
import com.pmt.model.Project;
import com.pmt.model.ProjectUser;
import com.pmt.model.Role;
import com.pmt.model.User;
import com.pmt.store.ProjectStore;
import com.pmt.store.ProjectUserStore;
import com.pmt.store.UserStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectUserServiceImplTest {

    @InjectMocks
    private ProjectUserServiceImpl projectUserService;

    @Mock
    private ProjectUserStore projectUserStore;

    @Mock
    private ProjectStore projectStore;

    @Mock
    private UserStore userStore;

    private Project project;
    private User user;
    private ProjectUser projectUser;

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
    }

    @Test
    void testGetProjectsByUserId_Success() {
        when(projectUserStore.findAllProjectByUserId(10L)).thenReturn(Collections.singletonList(project));

        List<Project> projects = projectUserService.getProjectsByUserId(10L);

        assertFalse(projects.isEmpty());
        assertEquals(1, projects.size());
        assertEquals("Test Project", projects.get(0).getNom());
        verify(projectUserStore).findAllProjectByUserId(10L);
    }

    @Test
    void testAddUsersToProject_Success() {
        UsersProject.UserRoleDTO userRoleDTO = new UsersProject.UserRoleDTO();
        userRoleDTO.setUserId(10L);
        userRoleDTO.setRole(Role.MEMBER);

        UsersProject request = new UsersProject();
        request.setProjectId(1L);
        request.setUsers(Collections.singletonList(userRoleDTO));

        when(projectStore.findById(1L)).thenReturn(Optional.of(project));
        when(userStore.findById(10L)).thenReturn(Optional.of(user));
        when(projectUserStore.save(any(ProjectUser.class))).thenReturn(projectUser);

        List<ProjectUser> result = projectUserService.addUsersToProject(request);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(project, result.get(0).getProject());
        assertEquals(user, result.get(0).getUser());
        verify(projectStore).findById(1L);
        verify(userStore).findById(10L);
        verify(projectUserStore).save(any(ProjectUser.class));
    }

    @Test
    void testAddUsersToProject_ProjectNotFound() {
        UsersProject request = new UsersProject();
        request.setProjectId(1L);
        request.setUsers(new ArrayList<>());

        when(projectStore.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ValidationException.class, () -> {
            projectUserService.addUsersToProject(request);
        });

        assertEquals("Project not found with ID: 1", exception.getMessage());
        verify(projectStore).findById(1L);
        verify(userStore, never()).findById(anyLong());
        verify(projectUserStore, never()).save(any(ProjectUser.class));
    }
    
    @Test
    void testAddUsersToProject_UserNotFound() {
        UsersProject.UserRoleDTO userRoleDTO = new UsersProject.UserRoleDTO();
        userRoleDTO.setUserId(10L);
        userRoleDTO.setRole(Role.MEMBER);

        UsersProject request = new UsersProject();
        request.setProjectId(1L);
        request.setUsers(Collections.singletonList(userRoleDTO));

        when(projectStore.findById(1L)).thenReturn(Optional.of(project));
        when(userStore.findById(10L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ValidationException.class, () -> {
            projectUserService.addUsersToProject(request);
        });

        assertEquals("User not found with ID: 10", exception.getMessage());
        verify(projectStore).findById(1L);
        verify(userStore).findById(10L);
        verify(projectUserStore, never()).save(any(ProjectUser.class));
    }

    @Test
    void testGetUsersProjectByProjectId_Success() {
        when(projectUserStore.findByProjectId(1L)).thenReturn(Collections.singletonList(projectUser));

        UsersProject result = projectUserService.getUsersProjectByProjectId(1L);

        assertNotNull(result);
        assertEquals(1L, result.getProjectId());
        assertFalse(result.getUsers().isEmpty());
        assertEquals(1, result.getUsers().size());
        assertEquals(10L, result.getUsers().get(0).getUserId());
        assertEquals(Role.MEMBER, result.getUsers().get(0).getRole());
        verify(projectUserStore).findByProjectId(1L);
    }

    @Test
    void testGetUsersProjectByProjectId_NoUsersFound() {
        when(projectUserStore.findByProjectId(1L)).thenReturn(Collections.emptyList());

        UsersProject result = projectUserService.getUsersProjectByProjectId(1L);

        assertNotNull(result);
        assertEquals(1L, result.getProjectId());
        assertTrue(result.getUsers().isEmpty());
        verify(projectUserStore).findByProjectId(1L);
    }
    
    @Test
    void testDeleteById_Success() {
        doNothing().when(projectUserStore).deleteById(100L);
        projectUserService.deleteById(100L);
        verify(projectUserStore).deleteById(100L);
    }
}
