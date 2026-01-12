package com.pmt.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Représente une entrée dans l'historique des modifications d'un projet ou d'une tâche.
 */
@Entity
@Table(name="historique")
public class Historique {
    /**
     * Identifiant unique de l'entrée d'historique.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Utilisateur ayant effectué la modification.
     */
    @ManyToOne
    private User user;

    /**
     * Identifiant du projet concerné par la modification (si applicable).
     */
    @Column(name = "project_id")
    private Long projectId;

    /**
     * Identifiant de la tâche concernée par la modification (si applicable).
     */
    @Column(name = "task_id")
    private Long taskId;

    /**
     * Date et heure de la modification.
     */
    @Column(name = "date_m")
    private LocalDateTime dateM;

    /**
     * Nouvelle valeur après modification.
     */
    private String newString;

    /**
     * Ancienne valeur avant modification.
     */
    private String oldString;

    /**
     * Type de champ modifié (ex: Titre, Description).
     */
    @Enumerated(EnumType.ORDINAL)
    @Column(name = "type_m")
    private Type typeM;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public LocalDateTime getDateM() {
        return dateM;
    }

    public void setDateM(LocalDateTime dateM) {
        this.dateM = dateM;
    }

    public String getNewString() {
        return newString;
    }

    public void setNewString(String modif) {
        this.newString = modif;
    }

    public Type getTypeM() {
        return typeM;
    }

    public void setTypeM(Type typeM) {
        this.typeM = typeM;
    }

    public String getOldString() {
        return oldString;
    }

    public void setOldString(String oldString) {
        this.oldString = oldString;
    }
}
