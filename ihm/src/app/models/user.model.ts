export interface User {
  id: number;
  nom: string;
  email: string;
}

export interface Assigned {
  id: number;
  userId: number;
  taskId: number;
  username: string;
}