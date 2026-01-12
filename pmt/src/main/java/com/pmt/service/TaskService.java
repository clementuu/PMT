package com.pmt.service;

import java.util.List;

import com.pmt.dto.TaskDTO;
import com.pmt.model.Task;

/**
 * Interface de service pour la gestion des tâches.
 */
public interface TaskService {
    /**
     * Récupère toutes les tâches.
     *
     * @return Une liste d'objets TaskDTO représentant toutes les tâches.
     */
    List<TaskDTO> findAll();
    /**
     * Récupère une tâche par son identifiant.
     *
     * @param id L'identifiant de la tâche.
     * @return Un objet TaskDTO représentant la tâche.
     */
    TaskDTO findById(Long id);
    /**
     * Crée une nouvelle tâche.
     *
     * @param dto L'objet TaskDTO contenant les informations de la tâche à créer.
     * @return L'objet Task créé.
     */
    Task create(TaskDTO dto);
    /**
     * Met à jour une tâche existante.
     *
     * @param task L'objet TaskDTO contenant les informations de la tâche à mettre à jour.
     * @return L'objet TaskDTO mis à jour.
     */
    TaskDTO update(TaskDTO task);
    /**
     * Supprime une tâche par son identifiant.
     *
     * @param taskId L'identifiant de la tâche à supprimer.
     */
    void deleteById(Long taskId);
}