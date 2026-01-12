package com.pmt.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Représente une tâche au sein d'un projet.
 */
@Entity
@Table(name = "task")
public class Task {
    /**
     * Identifiant unique de la tâche.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
     * Le projet auquel la tâche est associée.
     */
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @JsonBackReference
    private Project project;
    /**
     * La priorité de la tâche (LOW, MEDIUM, HIGH).
     */
    @Enumerated(EnumType.ORDINAL)
    private Priorite priorite;
    /**
     * Le statut actuel de la tâche (TODO, IN_PROGRESS, DONE).
     */
    @Enumerated(EnumType.ORDINAL)
    private Status status;

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
    public Priorite getPriorite() {
        return priorite;
    }
    public void setPriorite(Priorite priorite) {
        this.priorite = priorite;
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
    public Project getProject() {
        return project;
    }
    public void setProject(Project project) {
        this.project = project;
    }
    public Status getStatus() {
        return status;
    }
    public void setStatus(Status status) {
        this.status = status;
    }
}