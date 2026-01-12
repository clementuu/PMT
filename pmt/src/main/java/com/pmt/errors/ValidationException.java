package com.pmt.errors;

/**
 * Exception personnalisée pour les erreurs de validation.
 */
public class ValidationException extends RuntimeException {
    /**
     * Construit une nouvelle exception de validation avec le message spécifié.
     *
     * @param message Le message de détail de l'exception.
     */
    public ValidationException(String message) {
        super(message);
    }
}