import { Project } from "./project.model";

export interface Task {
    id: number;
    nom: string;
    description: string;
    dateFin: Date;
    dateEcheance: Date;
    project: Project;
    priorite: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}
