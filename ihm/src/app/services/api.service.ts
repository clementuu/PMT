import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginRequest, LoginResponse, SigninRequest } from '../models/requests.model';
import { Assigned, User } from '../models/user.model';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { UserProject, UsersProject } from '../models/userProject.model';
import { Historique } from '../models/historique.model';

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = "http://localhost:8080"

  constructor(private httpClient: HttpClient) {}

  postLogin(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/user/login`, loginRequest)
      .pipe(
        catchError(this.catchError)
      );
  }

  postUser(signinRequest: SigninRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/user`, signinRequest)
      .pipe(
        catchError(this.catchError)
      );
  }

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/user`)
      .pipe(
        catchError(this.catchError)
      );
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.httpClient.post<Project>(`${this.apiUrl}/project`, project)
      .pipe(
        catchError(this.catchError)
      );
  }

  getProjectsByUserId(userId: number): Observable<Project[]> {
    return this.httpClient.get<Project[]>(`${this.apiUrl}/project/user/${userId}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  getProjectById(id: number): Observable<Project> {
    return this.httpClient.get<Project>(`${this.apiUrl}/project/${id}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  updateProject(project: Project): Observable<Project> {
    return this.httpClient.put<Project>(`${this.apiUrl}/project`, project)
      .pipe(
        catchError(this.catchError)
      );
  }

  deleteProject(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/project/${id}`).pipe(
      catchError(this.catchError)
    );
  }

  getTask(id: number): Observable<Task>{
    return this.httpClient.get<Task>(`${this.apiUrl}/task/${id}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.httpClient.post<Task>(`${this.apiUrl}/task`, task)
      .pipe(
        catchError(this.catchError)
      );
  }

  updateTask(task: Task): Observable<Task> {
    return this.httpClient.put<Task>(`${this.apiUrl}/task`, task)
      .pipe(
        catchError(this.catchError)
      );
  }

  deleteTask(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/task/${id}`).pipe(
      catchError(this.catchError)
    );
  }

  postUsersProject(data: UsersProject): Observable<UsersProject> {
    return this.httpClient.post<UsersProject>(`${this.apiUrl}/project/user`, data)
      .pipe(
        catchError(this.catchError)
      );
  }

  getUsersProject(projectId: number): Observable<UsersProject> {
    return this.httpClient.get<UsersProject>(`${this.apiUrl}/project/user/list/${projectId}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  deleteUserProject(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/project/user/${id}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  assignTaskToUser(taskId: number, userId: number): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/assign/${taskId}/${userId}`, {})
      .pipe(
        catchError(this.catchError)
      );
  }

  getAllAssigned(taskId: number): Observable<Assigned[]> {
    return this.httpClient.get<Assigned[]>(`${this.apiUrl}/assign/${taskId}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  unassignTaskFromUser(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/assign/${id}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  getUsersByProjectId(id: number): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/user/project/${id}`)
      .pipe(
        catchError(this.catchError)
      );
  }

  getHistoriqueForProject(projectId: number): Observable<Historique[]> {
    return this.httpClient.get<Historique[]>(`${this.apiUrl}/historique/project/${projectId}`)
      .pipe(
          catchError(this.catchError)
        );
  }

  getHistoriqueForTask(taskId: number): Observable<Historique[]> {
    return this.httpClient.get<Historique[]>(`${this.apiUrl}/historique/task/${taskId}`)
      .pipe(
          catchError(this.catchError)
        );
  }

  catchError(error: HttpErrorResponse) {
    const apiError: ApiError = {
      message: error.message || "Une erreur inconnue s'est produite",
      status: error.status,
      details: error.error ?? "Aucune information sur l'erreur"
    };
    alert("Erreur API: "+apiError.details.error); 
    return throwError(() => apiError);
  }
}
