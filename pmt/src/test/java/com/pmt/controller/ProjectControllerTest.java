package com.pmt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pmt.config.TestBeansConfig;
import com.pmt.dto.ProjectUpdate;
import com.pmt.errors.ValidationException;
import com.pmt.model.Project;
import com.pmt.service.ProjectService;

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

@WebMvcTest(ProjectController.class)
@Import(TestBeansConfig.class)
class ProjectControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired 
    private ProjectService projectService;

    @Autowired
    private ObjectMapper objectMapper;

    private Project project;

    @BeforeEach
    void setUp() {
        project = new Project();
        project.setId(1L);
        project.setNom("Test Project");
        project.setDescription("A test project description.");
    }

    @Test
    void testGetAll_Success() throws Exception {
        when(projectService.findAll()).thenReturn(Collections.singletonList(project));

        mockMvc.perform(get("/project"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nom").value("Test Project"));
    }

    @Test
    void testGetProject_Success() throws Exception {
        when(projectService.findById(1L)).thenReturn(project);

        mockMvc.perform(get("/project/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Test Project"));
    }

    @Test
    void testGetProject_NotFound() throws Exception {
        when(projectService.findById(1L)).thenThrow(new ValidationException("Not Found"));

        mockMvc.perform(get("/project/1"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testCreateProject_Success() throws Exception {
        when(projectService.create(any(Project.class))).thenReturn(project);

        mockMvc.perform(post("/project")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(project)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nom").value("Test Project"));
    }

    @Test
    void testCreateProject_ValidationException() throws Exception {
        when(projectService.create(any(Project.class))).thenThrow(new ValidationException("Project name cannot be empty"));

        mockMvc.perform(post("/project")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(project)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Project name cannot be empty"));
    }

    @Test
    void testPutProject_Success() throws Exception {
        // Mock the update method to return the updated project
        when(projectService.update(any(ProjectUpdate.class))).thenReturn(project);

        mockMvc.perform(put("/project")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(project))) // project is a Project, but ProjectUpdate has same fields needed
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Test Project"));
    }

    @Test
    void testDeleteProject_Success() throws Exception {
        doNothing().when(projectService).deleteProject(1L);

        mockMvc.perform(delete("/project/1"))
                .andExpect(status().isOk());
    }
    
    @Test
    void testDeleteProject_Failure() throws Exception {
        doThrow(new ValidationException("Cannot delete")).when(projectService).deleteProject(1L);

        mockMvc.perform(delete("/project/1"))
                .andExpect(status().isBadRequest());
    }
}