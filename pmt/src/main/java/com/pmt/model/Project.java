package com.pmt.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * Représente un projet au sein de l'application.
 */
@Entity
@Table(name = "project")
public class Project {
    /**
     * Identifiant unique du projet.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nom du projet.
     */
    private String nom;

    /**
     * Description détaillée du projet.
     */
    private String description;

    /**
     * Date de début du projet.
     */
    private LocalDate dateDebut;

    /**
     * Date de fin prévue du projet (peut être nulle).
     */
    private LocalDate dateFin;

    /**
     * Liste des tâches associées à ce projet.
     * La relation est gérée par le champ "project" dans l'entité Task.
     */
    @OneToMany(mappedBy = "project")
    @JsonManagedReference
    private List<Task> tasks;

    /**
     * Liste des associations entre ce projet et les utilisateurs.
     * La relation est gérée par le champ "project" dans l'entité ProjectUser.
     */
    @OneToMany(mappedBy = "project")
    private List<ProjectUser> projectUsers;

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
    public LocalDate getDateDebut() {
        return dateDebut;
    }
    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }
    public LocalDate getDateFin() {
        return dateFin;
    }
    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }
    public List<Task> getTasks() {
        return tasks;
    }
    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
    
}
