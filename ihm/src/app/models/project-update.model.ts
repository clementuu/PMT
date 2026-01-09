import { Project } from './project.model';

export interface ProjectUpdatePayload {
  project: Project;
  userId: number;
}
