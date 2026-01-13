/**
 * Interface représentant un utilisateur.
 */
export interface User {
  /**
   * L'identifiant unique de l'utilisateur.
   */
  id: number;
  /**
   * Le nom de l'utilisateur.
   */
  nom: string;
  /**
   * L'adresse e-mail de l'utilisateur.
   */
  email: string;
}

/**
 * Interface représentant un utilisateur assigné à une tâche.
 */
export interface Assigned {
  /**
   * L'identifiant unique de l'assignation.
   */
  id: number;
  /**
   * L'identifiant de l'utilisateur assigné.
   */
  userId: number;
  /**
   * L'identifiant de la tâche à laquelle l'utilisateur est assigné.
   */
  taskId: number;
  /**
   * Le nom d'utilisateur de la personne assignée.
   */
  username: string;
}