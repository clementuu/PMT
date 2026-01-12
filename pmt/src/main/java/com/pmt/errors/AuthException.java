package com.pmt.errors;

/**
 * Exception personnalisée pour les erreurs d'authentification.
 */
public class AuthException extends RuntimeException {
    /**
     * Construit une nouvelle exception d'authentification avec le message spécifié.
     *
     * @param message Le message de détail de l'exception.
     */
    public AuthException(String message) {
        super(message);
    }
}