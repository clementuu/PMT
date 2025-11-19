import { Task } from "./task.model";

export interface Project {
    id: number;
    nom: string;
    description: string;
    dateFin: Date;
    tasks: Task[];
}
