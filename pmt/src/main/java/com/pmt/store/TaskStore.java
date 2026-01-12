package com.pmt.store;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.pmt.model.Task;
import org.springframework.transaction.annotation.Transactional;

/**
 * Interface de dépôt pour l'accès aux données des tâches.
 */
public interface TaskStore extends CrudRepository<Task, Long> {
    /**
     * Supprime toutes les tâches associées à un projet donné.
     *
     * @param projectId L'identifiant du projet.
     */
    @Transactional
    void deleteByProjectId(Long projectId);
    /**
     * Récupère toutes les tâches associées à un projet donné.
     *
     * @param projectId L'identifiant du projet.
     * @return Une liste d'objets Task.
     */
    List<Task> findByProjectId(Long projectId);
}