package com.pmt.store;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.pmt.model.Historique;

/**
 * Interface de dépôt pour l'accès aux données d'historique.
 */
public interface HistoriqueStore extends CrudRepository<Historique, Long> {
    /**
     * Récupère toutes les entrées d'historique associées à un projet donné.
     *
     * @param projectId L'identifiant du projet.
     * @return Une liste d'objets Historique.
     */
    List<Historique> findAllByProjectId(Long projectId);
    /**
     * Récupère toutes les entrées d'historique associées à une tâche donnée.
     *
     * @param taskId L'identifiant de la tâche.
     * @return Une liste d'objets Historique.
     */
    List<Historique> findAllByTaskId(Long taskId);
}