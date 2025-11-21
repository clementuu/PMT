export interface Task {
    id: number;
    nom: string;
    description: string;
    dateFin: Date;
    dateEcheance: Date;
    projectId: number;
    priorite: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}
