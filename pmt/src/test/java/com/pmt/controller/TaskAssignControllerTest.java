package com.pmt.controller;

import com.pmt.config.TestBeansConfig;
import com.pmt.dto.Assigned;
import com.pmt.errors.ValidationException;
import com.pmt.model.Task;
import com.pmt.model.TaskAssign;
import com.pmt.model.User;
import com.pmt.service.TaskAssignService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskAssignController.class)
@Import(TestBeansConfig.class)
class TaskAssignControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TaskAssignService taskAssignService;

    private User user;
    private Task task;
    private TaskAssign taskAssign;
    private Assigned assignedDTO;

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

        assignedDTO = new Assigned(1000L, 10L, 100L, "Test User");
    }

    @Test
    void testPostTaskAssign_Success() throws Exception {
        when(taskAssignService.create(anyLong(), anyLong())).thenReturn(taskAssign);

        mockMvc.perform(post("/assign/100/10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1000L));
    }

    @Test
    void testPostTaskAssign_BadRequest() throws Exception {
        when(taskAssignService.create(anyLong(), anyLong())).thenThrow(new ValidationException("Invalid assignment"));

        mockMvc.perform(post("/assign/100/10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Invalid assignment"));
    }

    @Test
    void testGetUsersByTaskId_Success() throws Exception {
        when(taskAssignService.getUsersByTaskId(anyLong())).thenReturn(Collections.singletonList(assignedDTO));

        mockMvc.perform(get("/assign/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("Test User"));
    }

    @Test
    void testGetUsersByTaskId_BadRequest() throws Exception {
        when(taskAssignService.getUsersByTaskId(anyLong())).thenThrow(new ValidationException("Invalid task ID"));

        mockMvc.perform(get("/assign/100"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Invalid task ID"));
    }

    @Test
    void testDeleteById_Success() throws Exception {
        doNothing().when(taskAssignService).deleteById(1000L);

        mockMvc.perform(delete("/assign/1000"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteById_BadRequest() throws Exception {
        doThrow(new ValidationException("Cannot delete assignment")).when(taskAssignService).deleteById(1000L);

        mockMvc.perform(delete("/assign/1000"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Cannot delete assignment"));
    }
}
