import { User } from './user.model';
import { Type } from './type.model';

/**
 * Interface représentant l'historique des modifications d'un projet ou d'une tâche.
 */
export interface Historique {
    /**
     * L'identifiant unique de l'entrée d'historique.
     */
    id: number;
    /**
     * L'utilisateur ayant effectué la modification.
     */
    user: User;
    /**
     * L'identifiant du projet si la modification concerne un projet.
     * Optionnel, car l'historique peut concerner une tâche.
     */
    projectId?: number;
    /**
     * L'identifiant de la tâche si la modification concerne une tâche.
     * Optionnel, car l'historique peut concerner un projet.
     */
    taskId?: number;
    /**
     * La date et l'heure de la modification.
     */
    dateM: Date;
    /**
     * La nouvelle valeur de la propriété modifiée.
     */
    newString: string;
    /**
     * L'ancienne valeur de la propriété modifiée.
     */
    oldString: string;
    /**
     * Le type de modification effectuée.
     */
    typeM: Type;
}