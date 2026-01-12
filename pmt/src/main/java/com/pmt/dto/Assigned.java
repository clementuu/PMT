package com.pmt.dto;

/**
 * DTO représentant l'assignation d'une tâche.
 */
public class Assigned {
    /**
     * Identifiant unique de l'assignation.
     */
    private Long id;
    /**
     * Identifiant de l'utilisateur assigné.
     */
    private Long userId;
    /**
     * Identifiant de la tâche assignée.
     */
    private Long taskId;
    /**
     * Nom d'utilisateur de la personne assignée.
     */
    private String username;

    public Assigned(Long id, Long userId, Long taskId, String nom) {
        this.id = id;
        this.userId = userId;
        this.taskId = taskId;
        this.username = nom; 
    }
    // Getters et setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getTaskId() {
        return taskId;
    }
    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
}