import { User } from './user.model';
import { Type } from './type.model';

export interface Historique {
    id: number;
    user: User;
    projectId?: number;
    taskId?: number;
    dateM: Date;
    newString: string;
    oldString: string;
    typeM: Type;
}
