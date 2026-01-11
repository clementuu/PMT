import { Task } from "./task.model";

export interface Project {
    id: number;
    nom: string;
    description: string;
    dateDebut: Date;
    dateFin: Date;
    tasks: Task[];
}
