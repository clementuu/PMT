export interface Task {
    /**
     * L'identifiant unique de la tâche.
     */
    id: number;
    /**
     * Le nom de la tâche.
     */
    nom: string;
    /**
     * La description de la tâche.
     */
    description: string;
    /**
     * La date de fin effective de la tâche.
     */
    dateFin: Date;
    /**
     * La date d'échéance de la tâche.
     */
    dateEcheance: Date;
    /**
     * L'identifiant du projet auquel la tâche est associée.
     */
    projectId: number;
    /**
     * La priorité de la tâche : 'LOW' (Faible), 'MEDIUM' (Moyenne), 'HIGH' (Élevée).
     */
    priorite: 'LOW' | 'MEDIUM' | 'HIGH';
    /**
     * Le statut actuel de la tâche : 'TODO' (À faire), 'IN_PROGRESS' (En cours), 'DONE' (Terminé).
     */
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}