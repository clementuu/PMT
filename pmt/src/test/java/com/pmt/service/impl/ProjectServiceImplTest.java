package com.pmt.service.impl;

import com.pmt.dto.ProjectUpdate;
import com.pmt.errors.ValidationException;
import com.pmt.model.Project;
import com.pmt.model.Task;
import com.pmt.service.UserService;
import com.pmt.store.HistoriqueStore;
import com.pmt.store.ProjectStore;
import com.pmt.store.ProjectUserStore;
import com.pmt.store.TaskAssignStore;
import com.pmt.store.TaskStore;
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
class ProjectServiceImplTest {

    @InjectMocks
    private ProjectServiceImpl projectService;

    @Mock
    private ProjectStore projectStore;
    @Mock
    private TaskStore taskStore;
    @Mock
    private TaskAssignStore taskAssignStore;
    @Mock
    private ProjectUserStore projectUserStore;
    @Mock
    private UserService userService;
    @Mock
    private HistoriqueStore historiqueStore;

    private Project project;
    private Task task1;
    private Task task2;

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setId(1L);
        project.setNom("Test Project");
        project.setDescription("Description for Test Project");

        task1 = new Task();
        task1.setId(101L);
        task1.setProject(project);

        task2 = new Task();
        task2.setId(102L);
        task2.setProject(project);
    }

    @Test
    void testFindAll_Success() {
        List<Project> projects = new ArrayList<>();
        projects.add(project);
        when(projectStore.findAll()).thenReturn(projects);

        List<Project> foundProjects = projectService.findAll();

        assertFalse(foundProjects.isEmpty());
        assertEquals(1, foundProjects.size());
        assertEquals(project.getNom(), foundProjects.get(0).getNom());
        verify(projectStore).findAll();
    }

    @Test
    void testFindAll_NoProjects() {
        when(projectStore.findAll()).thenReturn(Collections.emptyList());

        List<Project> foundProjects = projectService.findAll();

        assertTrue(foundProjects.isEmpty());
        verify(projectStore).findAll();
    }

    @Test
    void testFindById_ProjectExists() {
        when(projectStore.findById(1L)).thenReturn(Optional.of(project));

        Project foundProject = projectService.findById(1L);

        assertNotNull(foundProject);
        assertEquals(project.getId(), foundProject.getId());
        verify(projectStore).findById(1L);
    }

    @Test
    void testFindById_ProjectNotFound() {
        when(projectStore.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ValidationException.class, () -> {
            projectService.findById(1L);
        });

        assertEquals("Projet non trouvé avec l'ID: 1", exception.getMessage());
        verify(projectStore).findById(1L);
    }

    @Test
    void testCreate_Success() {
        when(projectStore.save(any(Project.class))).thenReturn(project);

        Project createdProject = projectService.create(project);

        assertNotNull(createdProject);
        assertEquals(project.getNom(), createdProject.getNom());
        verify(projectStore).save(any(Project.class));
    }

    @Test
    void testCreate_MissingName() {
        project.setNom(null);

        Exception exception = assertThrows(ValidationException.class, () -> {
            projectService.create(project);
        });

        assertEquals("Le projet doit avoir un nom", exception.getMessage());
        verify(projectStore, never()).save(any(Project.class));
    }

    @Test
    void testCreate_MissingDescription() {
        project.setDescription("");

        Exception exception = assertThrows(ValidationException.class, () -> {
            projectService.create(project);
        });

        assertEquals("Le projet doit avoir une description", exception.getMessage());
        verify(projectStore, never()).save(any(Project.class));
    }

    @Test
    void testUpdate_ProjectNotFound() {
        Project updatedProjectDetails = new Project();
        updatedProjectDetails.setId(99L); // Non-existent ID
        updatedProjectDetails.setNom("New Name");
        updatedProjectDetails.setDescription("New Description");

        ProjectUpdate updatedDTO = new ProjectUpdate();
        updatedDTO.setProject(updatedProjectDetails);
        updatedDTO.setUserId(2L);
        when(projectStore.findById(99L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ValidationException.class, () -> {
            projectService.update(updatedDTO);
        });

        assertEquals("Le projet avec l'ID 99 n'existe pas.", exception.getMessage());
        verify(projectStore).findById(99L);
        verify(projectStore, never()).save(any(Project.class));
    }

    @Test
    void testUpdate_Success() {
        Project existingProject = new Project();
        existingProject.setId(1L);
        existingProject.setNom("Old Name");
        existingProject.setDescription("Old Description");

        Project newProject = new Project();
        newProject.setId(1L);
        newProject.setNom("New Name");
        newProject.setDescription("New Description");


        ProjectUpdate updatedProjectDetails = new ProjectUpdate();
        updatedProjectDetails.setProject(newProject);

        when(projectStore.findById(1L)).thenReturn(Optional.of(existingProject));
        when(projectStore.save(any(Project.class))).thenReturn(newProject);

        Project result = projectService.update(updatedProjectDetails);

        assertNotNull(result);
        assertEquals("New Name", result.getNom());
        assertEquals("New Description", result.getDescription());
        verify(projectStore).findById(1L);
        verify(projectStore).save(existingProject); // Verify that the modified existingProject is saved
    }

    @Test
    void testDeleteProject_Success_WithTasksAndAssignments() {
        List<Task> tasks = new ArrayList<>();
        tasks.add(task1);
        tasks.add(task2);

        when(taskStore.findByProjectId(1L)).thenReturn(tasks);
        doNothing().when(taskAssignStore).deleteByTaskId(anyLong());
        doNothing().when(taskStore).deleteByProjectId(1L);
        doNothing().when(projectUserStore).deleteByProjectId(1L);
        doNothing().when(projectStore).deleteById(1L);

        projectService.deleteProject(1L);

        verify(taskStore).findByProjectId(1L);
        verify(taskAssignStore).deleteByTaskId(task1.getId());
        verify(taskAssignStore).deleteByTaskId(task2.getId());
        verify(taskStore).deleteByProjectId(1L);
        verify(projectUserStore).deleteByProjectId(1L);
        verify(projectStore).deleteById(1L);
    }

    @Test
    void testDeleteProject_Success_NoTasks() {
        when(taskStore.findByProjectId(1L)).thenReturn(Collections.emptyList());
        doNothing().when(taskStore).deleteByProjectId(1L);
        doNothing().when(projectUserStore).deleteByProjectId(1L);
        doNothing().when(projectStore).deleteById(1L);

        projectService.deleteProject(1L);

        verify(taskStore).findByProjectId(1L);
        verify(taskAssignStore, never()).deleteByTaskId(anyLong()); // No assignments to delete
        verify(taskStore).deleteByProjectId(1L);
        verify(projectUserStore).deleteByProjectId(1L);
        verify(projectStore).deleteById(1L);
    }

    @Test
    void testDeleteProject_NullId() {
        Exception exception = assertThrows(ValidationException.class, () -> {
            projectService.deleteProject(null);
        });

        assertEquals("l'id ne peut pas être null", exception.getMessage());
        verify(projectStore, never()).deleteById(anyLong());
        verify(taskStore, never()).findByProjectId(anyLong());
    }
}
