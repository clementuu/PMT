package com.pmt.service;

import java.util.List;

import com.pmt.dto.UsersProject;
import com.pmt.model.Project;
import com.pmt.model.ProjectUser;

/**
 * Interface de service pour la gestion des utilisateurs au sein des projets.
 */
public interface ProjectUserService {
    /**
     * Récupère la liste des projets associés à un utilisateur donné.
     *
     * @param userId L'identifiant de l'utilisateur.
     * @return Une liste d'objets Project.
     */
    List<Project> getProjectsByUserId(Long userId);
    /**
     * Ajoute des utilisateurs à un projet avec des rôles spécifiques.
     *
     * @param request L'objet UsersProject contenant l'identifiant du projet et la liste des utilisateurs avec leurs rôles.
     * @return Une liste des objets ProjectUser créés ou mis à jour.
     */
    List<ProjectUser> addUsersToProject(UsersProject request);
    /**
     * Récupère les utilisateurs et leurs rôles pour un projet donné.
     *
     * @param projectId L'identifiant du projet.
     * @return Un objet UsersProject contenant la liste des utilisateurs et leurs rôles.
     */
    UsersProject getUsersProjectByProjectId(Long projectId);
    /**
     * Supprime une association ProjectUser par son identifiant.
     *
     * @param id L'identifiant de l'association ProjectUser à supprimer.
     */
    void deleteById(Long id);
}