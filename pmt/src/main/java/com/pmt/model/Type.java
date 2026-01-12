package com.pmt.model;

/**
 * Représente les types de champs qui peuvent être modifiés dans l'historique.
 * Remarque importante : cette énumération est utilisée avec {@code @Enumerated(EnumType.ORDINAL)}
 * dans une entité JPA, modifier l'ordre des éléments (Titre, Description) ou en insérer de nouveaux
 * pourrait causer des problèmes d'intégrité des données dans la base de données existante.
 */
public enum Type {
    /**
     * Représente le champ 'Titre'.
     */
    Titre, // 0
    /**
     * Représente le champ 'Description'.
     */
    Description // 1
}