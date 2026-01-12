package com.pmt.dto;

import com.pmt.model.User;

/**
 * DTO représentant la réponse à une requête de connexion d'un utilisateur.
 * Utilisé pour récupérer les informations de l'utilisateur.
 */
public class LoginResponse {
    /**
     * Booléen confirmant la validité de l'utilisateur
     */
    private boolean success;
    /**
     * Utilisateur connecté.
     */
    private User user;

    public LoginResponse(boolean success, User user) {
        this.success = success;
        this.user = user;
    }

    public boolean isSuccess() {
        return success;
    }

    public User getUser() {
        return user;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setUser(User user) {
        this.user = user;
    }
}