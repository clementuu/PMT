package com.pmt.service.impl;

import com.pmt.errors.AuthException;
import com.pmt.errors.ValidationException;
import com.pmt.model.ProjectUser;
import com.pmt.model.User;
import com.pmt.store.ProjectUserStore;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private UserStore userStore;

    @Mock
    private ProjectUserStore projectUserStore;

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
    void testFindById_UserExists() {
        when(userStore.findById(1L)).thenReturn(Optional.of(user));

        User foundUser = userService.findById(1L);

        assertNotNull(foundUser);
        assertEquals(user.getId(), foundUser.getId());
        verify(userStore).findById(1L);
    }

    @Test
    void testFindById_UserNotFound() {
        when(userStore.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(ValidationException.class, () -> {
            userService.findById(1L);
        });

        assertEquals("Utilisateur non trouvé avec l'ID: 1", exception.getMessage());
        verify(userStore).findById(1L);
    }

    @Test
    void testFindByProjectId_Success() {
        ProjectUser projectUser = new ProjectUser();
        projectUser.setUser(user);

        when(projectUserStore.findByProjectId(1L)).thenReturn(Collections.singletonList(projectUser));
        when(userStore.findById(1L)).thenReturn(Optional.of(user));

        List<User> users = userService.findByProjectId(1L);

        assertFalse(users.isEmpty());
        assertEquals(1, users.size());
        assertEquals("Test User", users.get(0).getNom());
        verify(projectUserStore).findByProjectId(1L);
        verify(userStore).findById(1L);
    }
    
    @Test
    void testFindByProjectId_NoUsers() {
        when(projectUserStore.findByProjectId(1L)).thenReturn(Collections.emptyList());

        List<User> users = userService.findByProjectId(1L);

        assertTrue(users.isEmpty());
        verify(projectUserStore).findByProjectId(1L);
        verify(userStore, never()).findById(anyLong());
    }

    @Test
    void testCreateUser_Success() {
        when(userStore.existsByEmail(user.getEmail())).thenReturn(false);
        when(userStore.save(user)).thenReturn(user);

        User createdUser = userService.create(user);

        assertNotNull(createdUser);
        assertEquals(user.getNom(), createdUser.getNom());
        verify(userStore).existsByEmail(user.getEmail());
        verify(userStore).save(user);
    }

    @Test
    void testCreateUser_EmailExists() {
        when(userStore.existsByEmail(user.getEmail())).thenReturn(true);

        Exception exception = assertThrows(ValidationException.class, () -> {
            userService.create(user);
        });

        assertEquals("Cet email est déjà utilisé.", exception.getMessage());
        verify(userStore).existsByEmail(user.getEmail());
        verify(userStore, never()).save(any(User.class));
    }

    @Test
    void testLogin_Success() {
        when(userStore.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        
        User loggedInUser = userService.login("test@example.com", "password");

        assertNotNull(loggedInUser);
        assertEquals(user.getEmail(), loggedInUser.getEmail());
        verify(userStore).findByEmail("test@example.com");
    }

    @Test
    void testLogin_UserNotFound() {
        when(userStore.findByEmail("test@example.com")).thenReturn(Optional.empty());

        Exception exception = assertThrows(AuthException.class, () -> {
            userService.login("test@example.com", "password");
        });

        assertEquals("Utilisateur non trouvé avec cet email.", exception.getMessage());
        verify(userStore).findByEmail("test@example.com");
    }

    @Test
    void testLogin_WrongPassword() {
        when(userStore.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        Exception exception = assertThrows(AuthException.class, () -> {
            userService.login("test@example.com", "wrongpassword");
        });

        assertEquals("Mot de passe incorrect.", exception.getMessage());
        verify(userStore).findByEmail("test@example.com");
    }
}
