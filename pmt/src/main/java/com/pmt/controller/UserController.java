package com.pmt.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pmt.dto.LoginRequest;
import com.pmt.dto.LoginResponse;
import com.pmt.errors.AuthException;
import com.pmt.errors.ValidationException;
import com.pmt.model.User;
import com.pmt.service.UserService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Contrôleur pour la gestion des utilisateurs et de l'authentification.
 */
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    UserService userService;

    /**
     * Récupère la liste de tous les utilisateurs.
     * @return Une liste d'utilisateurs.
     */
    @GetMapping("")
    public ResponseEntity<List<User>> getAllUser() {
        try {
            List<User> users = userService.findAll();
            return ResponseEntity.status(HttpStatus.OK).body(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Récupère un utilisateur par son ID.
     * @param id L'ID de l'utilisateur.
     * @return L'utilisateur correspondant.
     */
    @GetMapping("{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        try {
            User user = userService.findById(id);
            return ResponseEntity.status(HttpStatus.OK).body(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Crée un nouvel utilisateur (inscription).
     * @param user L'utilisateur à créer.
     * @return L'utilisateur créé.
     */
    @PostMapping("")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.create(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Connecte un utilisateur.
     * @param request Les informations de connexion (email, mot de passe).
     * @return Une réponse indiquant le succès de la connexion et les informations de l'utilisateur.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getEmail(), request.getMdp());
            return ResponseEntity.ok(new LoginResponse(true, user));
        } catch (AuthException e) {
            return ResponseEntity.ok(new LoginResponse(false, null));
        }
    }

    /**
     * Récupère les utilisateurs associés à un projet spécifique.
     * @param id L'ID du projet.
     * @return Une liste d'utilisateurs.
     */
    @GetMapping("/project/{id}")
    public ResponseEntity<?> getUsersByProjectId(@PathVariable Long id) {
        try {
            List<User> users = userService.findByProjectId(id);
            return ResponseEntity.status(HttpStatus.OK).body(users);
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
    
}
