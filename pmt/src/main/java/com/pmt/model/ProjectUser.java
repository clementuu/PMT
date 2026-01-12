package com.pmt.model;

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
 * Représente l'association entre un projet et un utilisateur, incluant le rôle de cet utilisateur au sein du projet.
 */
@Entity
@Table(name = "project_user")
public class ProjectUser {
    /**
     * Identifiant unique de l'association projet-utilisateur.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Le projet auquel l'utilisateur est associé.
     */
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    /**
     * L'utilisateur associé au projet.
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    /**
     * Rôle de l'utilisateur pour ce projet (ex: Admin, Membre, Observateur).
     */
    @Enumerated(EnumType.ORDINAL)
    private Role role;

    // Getters et setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Project getProject() {
        return project;
    }
    public void setProject(Project project) {
        this.project = project;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }
    
}
