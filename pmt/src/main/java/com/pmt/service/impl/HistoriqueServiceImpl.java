package com.pmt.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pmt.model.Historique;
import com.pmt.service.HistoriqueService;
import com.pmt.store.HistoriqueStore;

/**
 * Implémentation du service pour la gestion de l'historique des modifications.
 */
@Service
public class HistoriqueServiceImpl implements HistoriqueService {
    @Autowired
    private HistoriqueStore historiqueStore;

    /**
     * Récupère toutes les entrées d'historique pour un projet donné.
     * @param projectId L'ID du projet.
     * @return Une liste d'objets Historique.
     */
    @Override
    public List<Historique> findAllByProject(Long projectId) {
        return historiqueStore.findAllByProjectId(projectId);
    }

    /**
     * Récupère toutes les entrées d'historique pour une tâche donnée.
     * @param taskId L'ID de la tâche.
     * @return Une liste d'objets Historique.
     */
    @Override
    public List<Historique> findAllByTask(Long taskId) {
        return historiqueStore.findAllByTaskId(taskId);
    }
    
}
