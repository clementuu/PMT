package com.pmt.dto;

public class Assigned {
    private Long id;
    private Long userId;
    private Long taskId;
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
    public String getNom() {
        return username;
    }
    public void setNom(String username) {
        this.username = username;
    }
}
