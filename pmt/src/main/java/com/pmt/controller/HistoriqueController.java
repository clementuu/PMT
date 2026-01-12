package com.pmt.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pmt.model.Historique;
import com.pmt.service.HistoriqueService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Contrôleur pour la gestion de l'historique des projets et des tâches.
 */
@RestController
@RequestMapping("/historique")
public class HistoriqueController {
    @Autowired
    HistoriqueService historiqueService;
    
    /**
     * Récupère l'historique d'un projet par son ID.
     * @param id L'ID du projet.
     * @return La liste des entrées d'historique pour le projet.
     */
    @GetMapping("/project/{id}")
    public ResponseEntity<?> getProjetHistorique(@PathVariable Long id) {
        try {
            List<Historique> projet = historiqueService.findAllByProject(id);
            return ResponseEntity.status(HttpStatus.OK).body(projet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Récupère l'historique d'une tâche par son ID.
     * @param id L'ID de la tâche.
     * @return La liste des entrées d'historique pour la tâche.
     */
    @GetMapping("/task/{id}")
    public ResponseEntity<?>getTaskHistorique(@PathVariable Long id) {
        try {
            List<Historique> task = historiqueService.findAllByTask(id);
            return ResponseEntity.status(HttpStatus.OK).body(task);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
