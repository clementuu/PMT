package com.pmt.service.impl;

import com.pmt.dto.TaskDTO;
import com.pmt.errors.ValidationException;
import com.pmt.model.Project;
import com.pmt.model.Task;
import com.pmt.store.ProjectStore;
import com.pmt.store.TaskAssignStore;
import com.pmt.store.TaskStore;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @InjectMocks
    private TaskServiceImpl taskService;

    @Mock
    private TaskStore taskStore;

    @Mock
    private ProjectStore projectStore;

    @Mock
    private TaskAssignStore taskAssignStore;

    private Task task;
    private Project project;
    private TaskDTO taskDTO;

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setId(1L);
        project.setNom("Test Project");

        task = new Task();
        task.setId(101L);
        task.setNom("Test Task");
        task.setDescription("Task Description");
        task.setProject(project);

        taskDTO = new TaskDTO();
        taskDTO.setId(101L);
        taskDTO.setNom("Test Task DTO");
        taskDTO.setDescription("DTO Description");
        taskDTO.setProjectId(1L);
    }

    @Test
    void testFindById_TaskExists() {
        when(taskStore.findById(101L)).thenReturn(Optional.of(task));

        TaskDTO foundDto = taskService.findById(101L);

        assertNotNull(foundDto);
        assertEquals(task.getId(), foundDto.getId());
        assertEquals(task.getNom(), foundDto.getNom());
        verify(taskStore).findById(101L);
    }

    @Test
    void testFindById_TaskNotFound() {
        when(taskStore.findById(101L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ValidationException.class, () -> {
            taskService.findById(101L);
        });

        assertEquals("Tâche non trouvé avec l'ID: 101", exception.getMessage());
        verify(taskStore).findById(101L);
    }

    @Test
    void testFindAll_Success() {
        when(taskStore.findAll()).thenReturn(Collections.singletonList(task));

        List<TaskDTO> dtos = taskService.findAll();

        assertFalse(dtos.isEmpty());
        assertEquals(1, dtos.size());
        assertEquals(task.getNom(), dtos.get(0).getNom());
        verify(taskStore).findAll();
    }

    @Test
    void testCreate_Success() {
        when(projectStore.findById(1L)).thenReturn(Optional.of(project));
        when(taskStore.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Task createdTask = taskService.create(taskDTO);

        assertNotNull(createdTask);
        assertEquals(taskDTO.getNom(), createdTask.getNom());
        assertEquals(project, createdTask.getProject());
        verify(projectStore).findById(1L);
        verify(taskStore).save(any(Task.class));
    }

    @Test
    void testCreate_ProjectNotFound() {
        when(projectStore.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ValidationException.class, () -> {
            taskService.create(taskDTO);
        });

        assertEquals("Le projet spécifié n'existe pas.", exception.getMessage());
        verify(projectStore).findById(1L);
        verify(taskStore, never()).save(any(Task.class));
    }

    @Test
    void testUpdate_Success() {
        Task updatedInfo = new Task();
        updatedInfo.setId(101L);
        updatedInfo.setNom("Updated Name");
        
        when(taskStore.findById(101L)).thenReturn(Optional.of(task));
        when(taskStore.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Task result = taskService.update(updatedInfo);

        assertNotNull(result);
        assertEquals("Updated Name", result.getNom());
        verify(taskStore).findById(101L);
        verify(taskStore).save(task);
    }
    
    @Test
    void testUpdate_TaskNotFound() {
        Task updatedInfo = new Task();
        updatedInfo.setId(101L);

        when(taskStore.findById(101L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            taskService.update(updatedInfo);
        });

        assertEquals("La tâche avec l'ID 101 n'existe pas.", exception.getMessage());
        verify(taskStore).findById(101L);
        verify(taskStore, never()).save(any(Task.class));
    }

    @Test
    void testDeleteById_Success() {
        doNothing().when(taskAssignStore).deleteByTaskId(101L);
        doNothing().when(taskStore).deleteById(101L);

        taskService.deleteById(101L);

        verify(taskAssignStore).deleteByTaskId(101L);
        verify(taskStore).deleteById(101L);
    }

    @Test
    void testDeleteById_NullId() {
        Exception exception = assertThrows(ValidationException.class, () -> {
            taskService.deleteById(null);
        });

        assertEquals("l'id ne peut pas être null", exception.getMessage());
        verify(taskAssignStore, never()).deleteByTaskId(any());
        verify(taskStore, never()).deleteById(any());
    }
}
