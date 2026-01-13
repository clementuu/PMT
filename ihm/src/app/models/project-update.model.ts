import { Project } from './project.model';

/**
 * Interface représentant la charge utile pour la mise à jour d'un projet.
 */
export interface ProjectUpdatePayload {
  /**
   * L'objet Project contenant les données mises à jour du projet.
   */
  project: Project;
  /**
   * L'identifiant de l'utilisateur effectuant la mise à jour.
   */
  userId: number;
}