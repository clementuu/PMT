package com.pmt.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="historique")
public class Historique {
    @Id
    private Long id;
    @ManyToOne
    private User user;
    private Long project_id;
    private Long task_id;
    private LocalDateTime date_m;
    private String modif;
    private Type type;

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
    public Long getProject_id() {
        return project_id;
    }
    public void setProject_id(Long project_id) {
        this.project_id = project_id;
    }
    public Long getTask_id() {
        return task_id;
    }
    public void setTask_id(Long task_id) {
        this.task_id = task_id;
    }
    public LocalDateTime getDate_m() {
        return date_m;
    }
    public void setDate_m(LocalDateTime date_m) {
        this.date_m = date_m;
    }
    public String getModif() {
        return modif;
    }
    public void setModif(String modif) {
        this.modif = modif;
    }
    public Type getType() {
        return type;
    }
    public void setType(Type type) {
        this.type = type;
    }

    
}
