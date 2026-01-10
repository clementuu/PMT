package com.pmt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pmt.config.TestBeansConfig;
import com.pmt.dto.TaskDTO;
import com.pmt.errors.ValidationException;
import com.pmt.model.Task;
import com.pmt.model.Status;
import com.pmt.service.TaskService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class) 
@Import(TestBeansConfig.class)
class TaskControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired 
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    private Task task;
    private TaskDTO taskDTO;

    @BeforeEach
    void setUp() {
        task = new Task();
        task.setId(1L);
        task.setNom("Test Task");
        task.setDescription("Task Description");
        task.setStatus(Status.TODO);
        task.setDateEcheance(LocalDate.now().plusDays(5));

        taskDTO = new TaskDTO();
        taskDTO.setId(1L);
        taskDTO.setNom("Test Task DTO");
        taskDTO.setDescription("DTO Description");
        taskDTO.setStatus(Status.TODO);
        taskDTO.setProjectId(10L);
    }

    @Test
    void testGetAll_Success() throws Exception {
        List<TaskDTO> tasks = Collections.singletonList(taskDTO);
        when(taskService.findAll()).thenReturn(tasks);

        mockMvc.perform(get("/task"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nom").value("Test Task DTO"));
    }

    @Test
    void testGetTaskById_Success() throws Exception {
        when(taskService.findById(1L)).thenReturn(taskDTO);

        mockMvc.perform(get("/task/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Test Task DTO"));
    }

    @Test
    void testGetTaskById_NotFound() throws Exception {
        when(taskService.findById(1L)).thenThrow(new ValidationException("Task Not Found"));

        mockMvc.perform(get("/task/1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Task Not Found"));
    }

    @Test
    void testCreateTask_Success() throws Exception {
        when(taskService.create(any(TaskDTO.class))).thenReturn(task);

        mockMvc.perform(post("/task")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(taskDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nom").value("Test Task"));
    }

    @Test
    void testCreateTask_ValidationException() throws Exception {
        when(taskService.create(any(TaskDTO.class))).thenThrow(new ValidationException("Missing task name"));

        mockMvc.perform(post("/task")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(taskDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Missing task name"));
    }

    @Test
    void testPutTask_Success() throws Exception {
        when(taskService.update(any(TaskDTO.class))).thenReturn(taskDTO);

        mockMvc.perform(put("/task")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(taskDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Test Task DTO"));
    }

    @Test
    void testPutTask_ValidationException() throws Exception {
        when(taskService.update(any(TaskDTO.class))).thenThrow(new ValidationException("Invalid task ID"));

        mockMvc.perform(put("/task")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Invalid task ID"));
    }

    @Test
    void testDeleteTask_Success() throws Exception {
        doNothing().when(taskService).deleteById(1L);

        mockMvc.perform(delete("/task/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteTask_ValidationException() throws Exception {
        doThrow(new ValidationException("Cannot delete task")).when(taskService).deleteById(1L);

        mockMvc.perform(delete("/task/1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Cannot delete task"));
    }
}
