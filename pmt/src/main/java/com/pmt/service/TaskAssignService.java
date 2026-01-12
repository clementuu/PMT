package com.pmt.service;

import java.util.List;

import com.pmt.dto.Assigned;
import com.pmt.model.TaskAssign;

/**
 * Interface de service pour la gestion des assignations de tâches.
 */
public interface TaskAssignService {
    /**
     * Crée une nouvelle assignation de tâche.
     *
     * @param taskId L'identifiant de la tâche.
     * @param userId L'identifiant de l'utilisateur à assigner.
     * @return L'assignation de tâche créée.
     */
    TaskAssign create(Long taskId, Long userId);
    /**
     * Récupère la liste des utilisateurs assignés à une tâche donnée.
     *
     * @param taskId L'identifiant de la tâche.
     * @return Une liste d'objets Assigned.
     */
    List<Assigned> getUsersByTaskId(Long taskId);
    /**
     * Supprime toutes les assignations de tâches pour un identifiant de tâche donné.
     *
     * @param id L'identifiant de la tâche.
     */
    void deleteByTaskId(Long id);
    /**
     * Supprime une assignation de tâche par son identifiant.
     *
     * @param id L'identifiant de l'assignation de tâche.
     */
    void deleteById(Long id);
}