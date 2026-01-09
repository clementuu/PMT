package com.pmt.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pmt.config.TestBeansConfig;
import com.pmt.errors.AuthException;
import com.pmt.errors.ValidationException;
import com.pmt.model.LoginRequest;
import com.pmt.model.User;
import com.pmt.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@Import(TestBeansConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired 
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setNom("Test User");
        user.setEmail("test@example.com");
        user.setMdp("password");
    }

    @Test
    void testGetAllUser_Success() throws Exception {
        List<User> users = Collections.singletonList(user);
        when(userService.findAll()).thenReturn(users);

        mockMvc.perform(get("/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nom").value("Test User"));
    }
    
    @Test
    void testGetUser_Success() throws Exception {
        when(userService.findById(1L)).thenReturn(user);

        mockMvc.perform(get("/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nom").value("Test User"));
    }

    @Test
    void testGetUser_NotFound() throws Exception {
        when(userService.findById(1L)).thenThrow(new ValidationException("Not Found"));

        mockMvc.perform(get("/user/1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCreateUser_Success() throws Exception {
        when(userService.create(any(User.class))).thenReturn(user);

        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nom").value("Test User"));
    }

    @Test
    void testCreateUser_ValidationException() throws Exception {
        when(userService.create(any(User.class))).thenThrow(new ValidationException("Email already exists"));

        mockMvc.perform(post("/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Email already exists"));
    }
    
    @Test
    void testLogin_Success() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setMdp("password");
        
        when(userService.login(loginRequest.getEmail(), loginRequest.getMdp())).thenReturn(user);

        mockMvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.user.nom").value("Test User"));
    }

    @Test
    void testLogin_Failure() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setMdp("wrongpassword");

        when(userService.login(anyString(), anyString())).thenThrow(new AuthException("Bad credentials"));

        mockMvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.user").doesNotExist());
    }

    @Test
    void testGetUsersByProjectId_Success() throws Exception {
        List<User> users = Collections.singletonList(user);
        when(userService.findByProjectId(anyLong())).thenReturn(users);

        mockMvc.perform(get("/user/project/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nom").value("Test User"));
    }
}
