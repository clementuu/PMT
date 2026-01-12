package com.pmt.service;

import java.util.List;

import com.pmt.dto.ProjectUpdate;
import com.pmt.model.Project;

/**
 * Interface de service pour la gestion des projets.
 */
public interface ProjectService {
    /**
     * Récupère tous les projets.
     *
     * @return Une liste de tous les projets.
     */
    List<Project> findAll();
    /**
     * Récupère un projet par son identifiant.
     *
     * @param id L'identifiant du projet.
     * @return Le projet correspondant à l'identifiant, ou null s'il n'existe pas.
     */
    Project findById(Long id);
    /**
     * Crée un nouveau projet.
     *
     * @param project Le projet à créer.
     * @return Le projet créé.
     */
    Project create(Project project);
    /**
     * Met à jour un projet existant.
     *
     * @param project Les informations de mise à jour du projet.
     * @return Le projet mis à jour.
     */
    Project update(ProjectUpdate project);
    /**
     * Supprime un projet par son identifiant.
     *
     * @param id L'identifiant du projet à supprimer.
     */
    void deleteProject(Long id);
}