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




@RestController
@RequestMapping("/historique")
public class HistoriqueController {
    @Autowired
    HistoriqueService historiqueService;
    
    @GetMapping("/project/{id}")
    public ResponseEntity<?> getProjetHistorique(@PathVariable Long id) {
        try {
            List<Historique> projet = historiqueService.findAllByProject(id);
            return ResponseEntity.status(HttpStatus.OK).body(projet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
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
