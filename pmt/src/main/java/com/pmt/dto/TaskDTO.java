package com.pmt.dto;

import java.time.LocalDate;

import com.pmt.model.Priorite;
import com.pmt.model.Status;

/**
 * DTO représentant une tâche.
 */
public class TaskDTO {
    /**
     * Identifiant unique de la tâche.
     */
    private Long id;
    /**
     * Le nom de la tâche.
     */
    private String nom;
    /**
     * La description de la tâche.
     */
    private String description;
    /**
     * La date de fin de la tâche.
     */
    private LocalDate dateFin;
    /**
     * La date d'échéance de la tâche.
     */
    private LocalDate dateEcheance;
    /**
     * L'identifiant du projet auquel la tâche est associée.
     */
    private Long projectId;
    /**
     * L'identifiant de l'utilisateur auquel la tâche est assignée.
     */
    private Long userId;
    /**
     * La priorité de la tâche.
     */
    private Priorite priorite;
    /**
     * Le statut de la tâche.
     */
    private Status status;

    public TaskDTO() {};
    
    // Getters et setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public LocalDate getDateFin() {
        return dateFin;
    }
    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }
    public LocalDate getDateEcheance() {
        return dateEcheance;
    }
    public void setDateEcheance(LocalDate dateEcheance) {
        this.dateEcheance = dateEcheance;
    }
    public Long getProjectId() {
        return projectId;
    }
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
    public Priorite getPriorite() {
        return priorite;
    }
    public void setPriorite(Priorite priorite) {
        this.priorite = priorite;
    }
    public Status getStatus() {
        return status;
    }
    public void setStatus(Status status) {
        this.status = status;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}