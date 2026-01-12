package com.pmt.store;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import com.pmt.model.TaskAssign;
import java.util.List;

/**
 * Interface de dépôt pour l'accès aux données des assignations de tâches.
 */
public interface TaskAssignStore extends CrudRepository<TaskAssign, Long> {
    /**
     * Supprime toutes les assignations de tâches pour un identifiant de tâche donné.
     *
     * @param taskId L'identifiant de la tâche.
     */
    @Transactional
    void deleteByTaskId(Long taskId);
    /**
     * Récupère toutes les assignations de tâches pour un identifiant de tâche donné.
     *
     * @param taskId L'identifiant de la tâche.
     * @return Une liste d'objets TaskAssign.
     */
    List<TaskAssign> findByTaskId(Long taskId);
    /**
     * Supprime une assignation de tâche par son identifiant.
     *
     * @param id L'identifiant de l'assignation de tâche.
     */
    void deleteById(Long id);
}