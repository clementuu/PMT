package com.pmt.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pmt.dto.UsersProject;
import com.pmt.model.Project;
import com.pmt.model.ProjectUser;
import com.pmt.service.ProjectUserService;

/**
 * Contrôleur pour la gestion des utilisateurs au sein des projets.
 */
@RestController
@RequestMapping("/project/user")
public class ProjectUserController {
    @Autowired
    ProjectUserService projectUserService;

    /**
     * Récupère tous les projets associés à un utilisateur.
     * @param userId L'ID de l'utilisateur.
     * @return Une liste de projets.
     */
    @GetMapping("{userId}")
    public ResponseEntity<List<Project>> getProjectsByUserId(@PathVariable Long userId) {
        try{
            List<Project> projets = projectUserService.getProjectsByUserId(userId);
            return ResponseEntity.status(HttpStatus.OK).body(projets);
        } catch (Exception e ) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Ajoute un ou plusieurs utilisateurs à un projet.
     * @param request La requête contenant l'ID du projet et la liste des utilisateurs.
     * @return La liste des associations créées.
     */
    @PostMapping("")
    public ResponseEntity<?> addUsersToProject(@RequestBody UsersProject request) {
        try {
            List<ProjectUser> newProjectUsers = projectUserService.addUsersToProject(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(newProjectUsers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Récupère la liste des utilisateurs d'un projet spécifique.
     * @param projectId L'ID du projet.
     * @return Un objet contenant les informations sur les utilisateurs du projet.
     */
    @GetMapping("/list/{projectId}")
    public ResponseEntity<UsersProject> getUsersByProjectId(@PathVariable Long projectId) {
        try {
            UsersProject projectUsers = projectUserService.getUsersProjectByProjectId(projectId);
            return ResponseEntity.status(HttpStatus.OK).body(projectUsers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Supprime l'association d'un utilisateur à un projet par l'ID de l'association.
     * @param id L'ID de l'enregistrement ProjectUser.
     * @return Une réponse HTTP sans contenu.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        try {
            projectUserService.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
