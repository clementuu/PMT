package com.pmt.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pmt.dto.Assigned;
import com.pmt.model.TaskAssign;
import com.pmt.service.TaskAssignService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Contrôleur pour l'assignation des tâches aux utilisateurs.
 */
@RestController
@RequestMapping("/assign")
public class TaskAssignController {
    @Autowired
    TaskAssignService taskAssignService;

    /**
     * Assigne une tâche à un utilisateur.
     * @param taskId L'ID de la tâche.
     * @param userId L'ID de l'utilisateur.
     * @return L'assignation créée.
     */
    @PostMapping("/{taskId}/{userId}")
    public ResponseEntity<?> postTaskAssign(@PathVariable Long taskId, @PathVariable Long userId) {
        try {
            TaskAssign newTaskAssign = taskAssignService.create(taskId, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(newTaskAssign); 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Récupère la liste des utilisateurs assignés à une tâche.
     * @param taskId L'ID de la tâche.
     * @return Une liste d'utilisateurs assignés.
     */
    @GetMapping("{taskId}")
    public ResponseEntity<?> getUsersByTaskId(@PathVariable Long taskId) {
        try {
            List<Assigned> users = taskAssignService.getUsersByTaskId(taskId);
            return ResponseEntity.status(HttpStatus.OK).body(users); 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Supprime une assignation de tâche par son ID.
     * @param id L'ID de l'assignation.
     * @return Une réponse HTTP sans contenu.
     */
    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteByID(@PathVariable Long id) {
        try {
            taskAssignService.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
