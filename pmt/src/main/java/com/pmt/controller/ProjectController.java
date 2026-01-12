package com.pmt.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pmt.dto.ProjectUpdate;
import com.pmt.errors.ValidationException;
import com.pmt.model.Project;
import com.pmt.service.ProjectService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

/**
 * Contrôleur pour les opérations CRUD sur les projets.
 */
@RestController
@RequestMapping("/project")
public class ProjectController {
    @Autowired
    ProjectService projectService;

    /**
     * Récupère la liste de tous les projets.
     * @return Une liste de projets.
     */
    @GetMapping("")
    public List<Project> getAll() {
        return projectService.findAll();
    }

    /**
     * Récupère un projet par son ID.
     * @param id L'ID du projet.
     * @return Le projet correspondant.
     */
    @GetMapping("{id}")
    public ResponseEntity<Project> getProject(@PathVariable Long id) {
        try {
            Project projet = projectService.findById(id);
            return ResponseEntity.status(HttpStatus.OK).body(projet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Crée un nouveau projet.
     * @param project Le projet à créer.
     * @return Le projet créé.
     */
    @PostMapping("")
    public ResponseEntity<?> createProject(@RequestBody Project project) {
        try {
            Project createdProject = projectService.create(project);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Met à jour un projet existant.
     * @param project Les informations de mise à jour du projet.
     * @return Le projet mis à jour.
     */
    @PutMapping("")
    public ResponseEntity<?> putProject(@RequestBody ProjectUpdate project) {
        try {
            Project updatedProject = projectService.update(project);
            return ResponseEntity.status(HttpStatus.OK).body(updatedProject);
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Supprime un projet par son ID.
     * @param id L'ID du projet à supprimer.
     * @return Une réponse HTTP sans contenu.
     */
    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
