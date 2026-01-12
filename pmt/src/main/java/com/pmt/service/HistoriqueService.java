package com.pmt.service;

import java.util.List;

import com.pmt.model.Historique;

/**
 * Interface de service pour la gestion de l'historique des modifications.
 */
public interface HistoriqueService {
    /**
     * Récupère toutes les entrées d'historique pour un projet donné.
     *
     * @param project_id L'identifiant du projet.
     * @return Une liste d'objets Historique associés au projet.
     */
    List<Historique> findAllByProject(Long project_id);
    /**
     * Récupère toutes les entrées d'historique pour une tâche donnée.
     *
     * @param task_id L'identifiant de la tâche.
     * @return Une liste d'objets Historique associés à la tâche.
     */
    List<Historique> findAllByTask(Long task_id);
}