package com.pmt.model;

/**
 * Représente les différents statuts de progression qu'une tâche peut avoir.
 * Remarque importante : cette énumération est utilisée avec {@code @Enumerated(EnumType.ORDINAL)}
 * dans une entité JPA, modifier l'ordre des éléments ou en insérer de nouveaux
 * pourrait causer des problèmes d'intégrité des données dans la base de données existante.
 */
public enum Status {
    /**
     * La tâche n'a pas encore commencé.
     */
    TODO,
    /**
     * La tâche est en cours de réalisation.
     */
    IN_PROGRESS,
    /**
     * La tâche est terminée.
     */
    DONE
}
