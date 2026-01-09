package com.pmt.config;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import com.pmt.service.ProjectService;
import com.pmt.service.ProjectUserService;
import com.pmt.service.TaskAssignService;
import com.pmt.service.TaskService;
import com.pmt.service.UserService;

@TestConfiguration
public class TestBeansConfig {
    @Bean
    TaskService taskService() {
        return Mockito.mock(TaskService.class);
    }

    @Bean
    UserService userService() {
        return Mockito.mock(UserService.class);
    }

    @Bean
    TaskAssignService taskAssignService() {
        return Mockito.mock(TaskAssignService.class);
    }

    @Bean
    ProjectUserService projectUserService() {
        return Mockito.mock(ProjectUserService.class);
    }

    @Bean
    ProjectService projectService() {
        return Mockito.mock(ProjectService.class);
    }
}
