package com.pmt.model;

/**
 * Représente les différents rôles qu'un utilisateur peut avoir au sein d'un projet.
 * Remarque importante : cette énumération est utilisée avec {@code @Enumerated(EnumType.ORDINAL)}
 * dans une entité JPA, modifier l'ordre des éléments ou en insérer de nouveaux
 * pourrait causer des problèmes d'intégrité des données dans la base de données existante.
 */
public enum Role {
    /**
     * Administrateur du projet, avec tous les droits.
     */
    ADMIN,
    /**
     * Membre du projet, avec des droits de création et de modification.
     */
    MEMBER,
    /**
     * Observateur du projet, avec des droits de lecture seule.
     */
    OBSERVER
}
