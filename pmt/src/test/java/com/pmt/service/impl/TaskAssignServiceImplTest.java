package com.pmt.service.impl;

import com.pmt.dto.Assigned;
import com.pmt.errors.ValidationException;
import com.pmt.model.Task;
import com.pmt.model.TaskAssign;
import com.pmt.model.User;
import com.pmt.store.TaskAssignStore;
import com.pmt.store.TaskStore;
import com.pmt.store.UserStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskAssignServiceImplTest {

    @InjectMocks
    private TaskAssignServiceImpl taskAssignService;

    @Mock
    private TaskAssignStore taskAssignStore;

    @Mock
    private UserStore userStore;

    @Mock
    private TaskStore taskStore;

    private User user;
    private Task task;
    private TaskAssign taskAssign;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(10L);
        user.setNom("Test User");

        task = new Task();
        task.setId(100L);
        task.setNom("Test Task");

        taskAssign = new TaskAssign();
        taskAssign.setId(1000L);
        taskAssign.setUser(user);
        taskAssign.setTask(task);
    }

    @Test
    void testCreate_Success() {
        when(taskStore.findById(100L)).thenReturn(Optional.of(task));
        when(userStore.findById(10L)).thenReturn(Optional.of(user));
        when(taskAssignStore.save(any(TaskAssign.class))).thenReturn(taskAssign);

        TaskAssign result = taskAssignService.create(100L, 10L);

        assertNotNull(result);
        assertEquals(task.getId(), result.getTask().getId());
        assertEquals(user.getId(), result.getUser().getId());
        verify(taskStore).findById(100L);
        verify(userStore).findById(10L);
        verify(taskAssignStore).save(any(TaskAssign.class));
    }

    @Test
    void testCreate_TaskNotFound() {
        when(taskStore.findById(100L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ValidationException.class, () -> {
            taskAssignService.create(100L, 10L);
        });

        assertEquals("Task not found with ID: 100", exception.getMessage());
        verify(taskStore).findById(100L);
        verify(userStore, never()).findById(anyLong());
        verify(taskAssignStore, never()).save(any(TaskAssign.class));
    }

    @Test
    void testCreate_UserNotFound() {
        when(taskStore.findById(100L)).thenReturn(Optional.of(task));
        when(userStore.findById(10L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ValidationException.class, () -> {
            taskAssignService.create(100L, 10L);
        });

        assertEquals("User not found with ID: 10", exception.getMessage());
        verify(taskStore).findById(100L);
        verify(userStore).findById(10L);
        verify(taskAssignStore, never()).save(any(TaskAssign.class));
    }

    @Test
    void testGetUsersByTaskId_Success() {
        when(taskAssignStore.findByTaskId(100L)).thenReturn(Collections.singletonList(taskAssign));
        when(userStore.findById(10L)).thenReturn(Optional.of(user));

        List<Assigned> result = taskAssignService.getUsersByTaskId(100L);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(user.getNom(), result.get(0).getUsername());
        verify(taskAssignStore).findByTaskId(100L);
        verify(userStore).findById(10L);
    }
    
    @Test
    void testGetUsersByTaskId_NoAssignments() {
        when(taskAssignStore.findByTaskId(100L)).thenReturn(Collections.emptyList());

        List<Assigned> result = taskAssignService.getUsersByTaskId(100L);

        assertTrue(result.isEmpty());
        verify(taskAssignStore).findByTaskId(100L);
        verify(userStore, never()).findById(anyLong());
    }

    @Test
    void testDeleteByTaskId_Success() {
        doNothing().when(taskAssignStore).deleteByTaskId(100L);
        taskAssignService.deleteByTaskId(100L);
        verify(taskAssignStore).deleteByTaskId(100L);
    }

    @Test
    void testDeleteByTaskId_NullId() {
        Exception exception = assertThrows(ValidationException.class, () -> {
            taskAssignService.deleteByTaskId(null);
        });
        assertEquals("l'id ne peut pas être null", exception.getMessage());
        verify(taskAssignStore, never()).deleteByTaskId(any());
    }

    @Test
    void testDeleteById_Success() {
        doNothing().when(taskAssignStore).deleteById(1000L);
        taskAssignService.deleteById(1000L);
        verify(taskAssignStore).deleteById(1000L);
    }

    @Test
    void testDeleteById_NullId() {
        Exception exception = assertThrows(ValidationException.class, () -> {
            taskAssignService.deleteById(null);
        });
        assertEquals("l'id ne peut pas être null", exception.getMessage());
        verify(taskAssignStore, never()).deleteById(any());
    }
}
