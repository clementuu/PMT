package com.pmt.store;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.pmt.model.Project;
import com.pmt.model.ProjectUser;
import org.springframework.transaction.annotation.Transactional;

/**
 * Interface de dépôt pour l'accès aux données des associations Projet-Utilisateur.
 */
public interface ProjectUserStore extends CrudRepository<ProjectUser, Long> {

    /**
     * Récupère tous les projets auxquels un utilisateur est associé.
     *
     * @param userId L'identifiant de l'utilisateur.
     * @return Une liste d'objets Project.
     */
    @Query("SELECT pu.project FROM ProjectUser pu WHERE pu.user.id = :userId")
    List<Project> findAllProjectByUserId(@Param("userId") Long userId);
    
    /**
     * Vérifie si une association existe entre un projet et un utilisateur.
     *
     * @param projectId L'identifiant du projet.
     * @param userId L'identifiant de l'utilisateur.
     * @return true si l'association existe, false sinon.
     */
    boolean existsByProjectIdAndUserId(Long projectId, Long userId); 
    
    /**
     * Récupère toutes les associations Projet-Utilisateur pour un projet donné.
     *
     * @param projectId L'identifiant du projet.
     * @return Une liste d'objets ProjectUser.
     */
    List<ProjectUser> findByProjectId(Long projectId);
    
    /**
     * Supprime toutes les associations Projet-Utilisateur pour un projet donné.
     *
     * @param projectId L'identifiant du projet.
     */
    @Transactional
    void deleteByProjectId(Long projectId);
}