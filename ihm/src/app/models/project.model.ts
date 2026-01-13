import { Task } from "./task.model";

/**
 * Interface représentant un projet.
 */
export interface Project {
    /**
     * L'identifiant unique du projet.
     */
    id: number;
    /**
     * Le nom du projet.
     */
    nom: string;
    /**
     * La description du projet.
     */
    description: string;
    /**
     * La date de début du projet.
     */
    dateDebut: Date;
    /**
     * La date de fin prévue du projet.
     */
    dateFin: Date;
    /**
     * Une liste des tâches associées à ce projet.
     */
    tasks: Task[];
}