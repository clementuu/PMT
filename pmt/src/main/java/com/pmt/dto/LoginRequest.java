package com.pmt.dto;

/**
 * DTO représentant la requête de connexion d'un utilisateur.
 * Utilisé pour transporter les informations d'identification de l'API.
 */
public class LoginRequest {
    /**
     * Adresse email de l'utilisateur pour la connexion.
     */
    private String email;
    /**
     * Mot de passe de l'utilisateur pour la connexion.
     */
    private String mdp;
    
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
