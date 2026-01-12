package com.pmt.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * Représente un utilisateur de l'application.
 */
@Entity
@Table(name = "user_app")
public class User {
    /**
     * Identifiant unique de l'utilisateur.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * Le nom de l'utilisateur.
     */
    private String nom;
    /**
     * L'adresse email de l'utilisateur (unique).
     */
    @Column(unique = true, nullable = false)
    private String email;
    /**
     * Le mot de passe de l'utilisateur.
     */
    private String mdp;
    /**
     * Liste des tâches assignées à l'utilisateur.
     */
    @ManyToMany
    private List<Task> tasks;
    /**
     * Liste des projets auxquels l'utilisateur est associé, avec son rôle.
     */
    @OneToMany(mappedBy = "user")
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
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getMdp() {
        return mdp;
    }
    public void setMdp(String mdp) {
        this.mdp = mdp;
    }
    
}