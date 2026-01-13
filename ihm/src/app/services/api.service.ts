import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginRequest, LoginResponse, SigninRequest } from '../models/requests.model';
import { Assigned, User } from '../models/user.model';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { UsersProject } from '../models/userProject.model';
import { Historique } from '../models/historique.model';
import { ProjectUpdatePayload } from '../models/project-update.model';

/**
 * Interface représentant une erreur API.
 */
export interface ApiError {
  /**
   * Message d'erreur destiné à l'utilisateur.
   */
  message: string;
  /**
   * Code de statut HTTP de l'erreur.
   */
  status: number;
  /**
   * Détails supplémentaires de l'erreur, si disponibles.
   */
  details?: any;
}

/**
 * Service Angular pour interagir avec l'API backend.
 * Fournit des méthodes pour les opérations CRUD sur les utilisateurs, projets, tâches, et l'historique.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  /**
   * URL de base de l'API backend.
   */
  private apiUrl: string = "http://localhost:8080"

  /**
   * Constructeur du service.
   * @param httpClient Le client HTTP d'Angular pour effectuer des requêtes.
   */
  constructor(private httpClient: HttpClient) {}

  /**
   * Envoie une requête de connexion à l'API.
   * @param loginRequest Les informations de connexion de l'utilisateur.
   * @returns Un Observable de la réponse de connexion.
   */
  postLogin(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/user/login`, loginRequest)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Envoie une requête pour créer un nouvel utilisateur (inscription).
   * @param signinRequest Les informations d'inscription de l'utilisateur.
   * @returns Un Observable du nouvel utilisateur créé.
   */
  postUser(signinRequest: SigninRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/user`, signinRequest)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Récupère la liste de tous les utilisateurs.
   * @returns Un Observable d'un tableau d'utilisateurs.
   */
  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/user`)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Crée un nouveau projet.
   * @param project Les données du projet à créer.
   * @returns Un Observable du projet créé.
   */
  createProject(project: Partial<Project>): Observable<Project> {
    return this.httpClient.post<Project>(`${this.apiUrl}/project`, project)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Récupère les projets associés à un utilisateur spécifique.
   * @param userId L'identifiant de l'utilisateur.
   * @returns Un Observable d'un tableau de projets.
   */
  getProjectsByUserId(userId: number): Observable<Project[]> {
    return this.httpClient.get<Project[]>(`${this.apiUrl}/project/user/${userId}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Récupère un projet par son identifiant.
   * @param id L'identifiant du projet.
   * @returns Un Observable du projet.
   */
  getProjectById(id: number): Observable<Project> {
    return this.httpClient.get<Project>(`${this.apiUrl}/project/${id}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Met à jour un projet existant.
   * @param payload Les données de mise à jour du projet, incluant l'ID utilisateur.
   * @returns Un Observable du projet mis à jour.
   */
  updateProject(payload: ProjectUpdatePayload): Observable<Project> {
    return this.httpClient.put<Project>(`${this.apiUrl}/project`, payload)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Supprime un projet par son identifiant.
   * @param id L'identifiant du projet à supprimer.
   * @returns Un Observable vide à la fin de l'opération.
   */
  deleteProject(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/project/${id}`).pipe(
      catchError(this.catchError)
    );
  }

  /**
   * Récupère une tâche par son identifiant.
   * @param id L'identifiant de la tâche.
   * @returns Un Observable de la tâche.
   */
  getTask(id: number): Observable<Task>{
    return this.httpClient.get<Task>(`${this.apiUrl}/task/${id}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Crée une nouvelle tâche.
   * @param task Les données de la tâche à créer.
   * @returns Un Observable de la tâche créée.
   */
  createTask(task: Partial<Task>): Observable<Task> {
    return this.httpClient.post<Task>(`${this.apiUrl}/task`, task)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Met à jour une tâche existante.
   * @param task Les données de la tâche à mettre à jour.
   * @returns Un Observable de la tâche mise à jour.
   */
  updateTask(task: Task): Observable<Task> {
    return this.httpClient.put<Task>(`${this.apiUrl}/task`, task)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Supprime une tâche par son identifiant.
   * @param id L'identifiant de la tâche à supprimer.
   * @returns Un Observable vide à la fin de l'opération.
   */
  deleteTask(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/task/${id}`).pipe(
      catchError(this.catchError)
    );
  }

  /**
   * Envoie une requête pour associer des utilisateurs à un projet avec leurs rôles.
   * @param data L'objet contenant l'ID du projet et la liste des rôles utilisateur.
   * @returns Un Observable de la réponse de l'opération.
   */
  postUsersProject(data: UsersProject): Observable<UsersProject> {
    return this.httpClient.post<UsersProject>(`${this.apiUrl}/project/user`, data)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Récupère les utilisateurs et leurs rôles pour un projet spécifique.
   * @param projectId L'identifiant du projet.
   * @returns Un Observable d'un objet UsersProject.
   */
  getUsersProject(projectId: number): Observable<UsersProject> {
    return this.httpClient.get<UsersProject>(`${this.apiUrl}/project/user/list/${projectId}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Supprime l'association d'un utilisateur à un projet par son identifiant UserProject.
   * @param id L'identifiant de l'association utilisateur-projet à supprimer.
   * @returns Un Observable vide à la fin de l'opération.
   */
  deleteUserProject(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/project/user/${id}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Assigné une tâche à un utilisateur.
   * @param taskId L'identifiant de la tâche.
   * @param userId L'identifiant de l'utilisateur.
   * @returns Un Observable vide à la fin de l'opération.
   */
  assignTaskToUser(taskId: number, userId: number): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/assign/${taskId}/${userId}`, {})
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Récupère toutes les assignations pour une tâche spécifique.
   * @param taskId L'identifiant de la tâche.
   * @returns Un Observable d'un tableau d'objets Assigned.
   */
  getAllAssigned(taskId: number): Observable<Assigned[]> {
    return this.httpClient.get<Assigned[]>(`${this.apiUrl}/assign/${taskId}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Désassigne une tâche d'un utilisateur par l'identifiant de l'assignation.
   * @param id L'identifiant de l'assignation à supprimer.
   * @returns Un Observable vide à la fin de l'opération.
   */
  unassignTaskFromUser(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/assign/${id}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Récupère la liste des utilisateurs associés à un projet spécifique.
   * @param id L'identifiant du projet.
   * @returns Un Observable d'un tableau d'utilisateurs.
   */
  getUsersByProjectId(id: number): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/user/project/${id}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  /**
   * Récupère l'historique des modifications pour un projet.
   * @param projectId L'identifiant du projet.
   * @returns Un Observable d'un tableau d'objets Historique.
   */
  getHistoriqueForProject(projectId: number): Observable<Historique[]> {
    return this.httpClient.get<Historique[]>(`${this.apiUrl}/historique/project/${projectId}`)
      .pipe(
          catchError(this.catchError)
        );
  }

  /**
   * Récupère l'historique des modifications pour une tâche.
   * @param taskId L'identifiant de la tâche.
   * @returns Un Observable d'un tableau d'objets Historique.
   */
  getHistoriqueForTask(taskId: number): Observable<Historique[]> {
    return this.httpClient.get<Historique[]>(`${this.apiUrl}/historique/task/${taskId}`)
      .pipe(
          catchError(this.catchError)
        );
  }

  /**
   * Gère les erreurs HTTP provenant des requêtes API.
   * Affiche une alerte à l'utilisateur et propage l'erreur.
   * @param error L'objet HttpErrorResponse.
   * @returns Un Observable d'erreur.
   */
  catchError(error: HttpErrorResponse) {
    let userFriendlyErrorMessage: string;
    if (typeof error.error === 'string') {
      userFriendlyErrorMessage = error.error;
    } else if (error.error && typeof error.error === 'object' && error.error.error) {
      userFriendlyErrorMessage = error.error.error;
    } else if (error.error && typeof error.error === 'object' && error.error.message) {
      userFriendlyErrorMessage = error.error.message;
    } else {
      userFriendlyErrorMessage = "Une erreur inconnue s'est produite";
    }

    const apiError: ApiError = {
      message: userFriendlyErrorMessage,
      status: error.status,
      details: error.error ?? "Aucune information sur l'erreur"
    };
    alert(`Erreur API: ${apiError.message}`); 
    return throwError(() => apiError);
  }
}