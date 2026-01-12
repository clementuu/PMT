package com.pmt.model;

/**
 * Représente les différents niveaux de priorité qui peuvent être assignés à une tâche.
 * Remarque importante : cette énumération est utilisée avec {@code @Enumerated(EnumType.ORDINAL)}
 * dans une entité JPA, modifier l'ordre des éléments (LOW, MEDIUM, HIGH) ou en insérer de nouveaux
 * pourrait causer des problèmes d'intégrité des données dans la base de données existante.
 */
public enum Priorite {
    /**
     * Priorité basse (valeur ordinale 0).
     */
    LOW,
    /**
     * Priorité moyenne (valeur ordinale 1).
     */
    MEDIUM,
    /**
     * Priorité haute (valeur ordinale 2).
     */
    HIGH
}
