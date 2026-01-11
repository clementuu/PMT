import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ApiService, ApiError } from './api.service';
import { LoginRequest, LoginResponse, SigninRequest } from '../models/requests.model';
import { Assigned, User } from '../models/user.model';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { UserProject, UsersProject } from '../models/userProject.model';
import { Historique } from '../models/historique.model';
import { ProjectUpdatePayload } from '../models/project-update.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  const ErrorApi: String = "Une erreur inconnue s'est produite"
  const apiUrl = "http://localhost:8080";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    spyOn(window, 'alert').and.stub(); // Mock window.alert
    spyOn(console, 'error').and.stub(); // Mock console.error
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure that no outstanding requests are in flight.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- postLogin ---
  it('postLogin should send a POST request and return LoginResponse', () => {
    const mockLoginRequest: LoginRequest = { email: 'test@example.com', mdp: 'password' };
    const mockLoginResponse: LoginResponse = { success: true, user: { id: 1, nom: 'Test', email: 'test@example.com' } };

    service.postLogin(mockLoginRequest).subscribe(response => {
      expect(response).toEqual(mockLoginResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/user/login`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockLoginRequest);
    req.flush(mockLoginResponse);
  });

  it('postLogin should handle errors', () => {
    const mockLoginRequest: LoginRequest = { email: 'test@example.com', mdp: 'password' };
    const mockError = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized', error: { message: ErrorApi } }); // Changed error to object

    service.postLogin(mockLoginRequest).subscribe({
      next: () => fail('should have failed with the 401 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(401);
        expect(error.message).toEqual(ErrorApi); // Assert against error.message
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/user/login`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- postUser ---
  it('postUser should send a POST request and return User', () => {
    const mockSigninRequest: SigninRequest = { nom: 'New User', email: 'new@example.com', mdp: 'newpassword' };
    const mockUser: User = { id: 2, nom: 'New User', email: 'new@example.com' };

    service.postUser(mockSigninRequest).subscribe(response => {
      expect(response).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/user`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockSigninRequest);
    req.flush(mockUser);
  });

  it('postUser should handle errors', () => {
    const mockSigninRequest: SigninRequest = { nom: 'New User', email: 'new@example.com', mdp: 'newpassword' };
    const mockError = new HttpErrorResponse({ status: 400, statusText: 'Bad Request', error: { message: ErrorApi } }); // Changed error to object

    service.postUser(mockSigninRequest).subscribe({
      next: () => fail('should have failed with the 400 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(400);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/user`);
    expect(req.request.method).toEqual('POST'); // This line was missing from the old string in the previous turn
    expect(req.request.body).toEqual(mockSigninRequest); // This line was missing from the old string in the previous turn
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- getAllUsers ---
  it('getAllUsers should send a GET request and return User[]', () => {
    const mockUsers: User[] = [{ id: 1, nom: 'U1', email: 'u1@e.com' }];

    service.getAllUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/user`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockUsers);
  });

  it('getAllUsers should handle errors', () => {
    const mockError = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });

    service.getAllUsers().subscribe({
      next: () => fail('should have failed with the 500 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(500);
        expect(window.alert).toHaveBeenCalled();
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/user`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- createProject ---
  it('createProject should send a POST request and return Project', () => {
    const mockProjectRequest: Partial<Project> = { nom: 'New Project', description: 'Desc' };
    const mockProjectResponse: Project = { id: 1, nom: 'New Project', description: 'Desc', dateDebut: new Date('2024-01-31'), dateFin: new Date('2024-12-31'), tasks: [] };

    service.createProject(mockProjectRequest).subscribe(project => {
      expect(project).toEqual(mockProjectResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/project`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockProjectRequest);
    req.flush(mockProjectResponse);
  });

  it('createProject should handle errors', () => {
    const mockProjectRequest: Partial<Project> = { nom: 'New Project', description: 'Desc' };
    const mockError = new HttpErrorResponse({ status: 400, statusText: 'Bad Request', error: { message: ErrorApi } });

    service.createProject(mockProjectRequest).subscribe({
      next: () => fail('should have failed with the 400 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(400);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/project`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- getProjectsByUserId ---
  it('getProjectsByUserId should send a GET request and return Project[]', () => {
    const userId = 1;
    const mockProjects: Project[] = [{ id: 1, nom: 'P1', description: 'D1', dateDebut: new Date('2024-01-31'), dateFin: new Date('2024-12-31'), tasks: [] }];

    service.getProjectsByUserId(userId).subscribe(projects => {
      expect(projects).toEqual(mockProjects);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/project/user/${userId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockProjects);
  });

  it('getProjectsByUserId should handle errors', () => {
    const userId = 1;
    const mockError = new HttpErrorResponse({ status: 404, statusText: 'Not Found', error: { error: ErrorApi } });

    service.getProjectsByUserId(userId).subscribe({
      next: () => fail('should have failed with the 404 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/project/user/${userId}`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- getProjectById ---
  it('getProjectById should send a GET request and return Project', () => {
    const projectId = 1;
    const mockProject: Project = { id: 1, nom: 'P1', description: 'D1', dateDebut: new Date('2024-01-31'), dateFin: new Date('2024-12-31'), tasks: [] };

    service.getProjectById(projectId).subscribe(project => {
      expect(project).toEqual(mockProject);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/project/${projectId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockProject);
  });

  // --- updateProject ---
  it('updateProject should send a PUT request and return Project', () => {
    const mockPayload: ProjectUpdatePayload = { project: { id: 1, nom: 'Updated', description: 'Upd', dateDebut: new Date('2024-01-31'), dateFin: new Date('2024-12-31'), tasks:[] }, userId: 1 };
    const mockProjectResponse: Project = { id: 1, nom: 'Updated', description: 'Upd', dateDebut: new Date('2024-01-31'), dateFin: new Date('2024-12-31'), tasks: [] };

    service.updateProject(mockPayload).subscribe(project => {
      expect(project).toEqual(mockProjectResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/project`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockProjectResponse);
  });

  it('updateProject should handle errors', () => {
    const mockPayload: ProjectUpdatePayload = { project: { id: 1, nom: 'Updated', description: 'Upd', dateDebut: new Date('2024-01-31'), dateFin: new Date('2024-12-31'), tasks:[]  }, userId: 1 };
    const mockError = new HttpErrorResponse({ status: 400, statusText: 'Bad Request', error: { message: ErrorApi } });

    service.updateProject(mockPayload).subscribe({
      next: () => fail('should have failed with the 400 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(400);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/project`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- deleteProject ---
  it('deleteProject should send a DELETE request', () => {
    const projectId = 1;

    service.deleteProject(projectId).subscribe();

    const req = httpTestingController.expectOne(`${apiUrl}/project/${projectId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });

  it('deleteProject should handle errors', () => {
    const projectId = 1;
    const mockError = new HttpErrorResponse({ status: 404, statusText: 'Not Found', error: { error: ErrorApi } });

    service.deleteProject(projectId).subscribe({
      next: () => fail('should have failed with the 404 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/project/${projectId}`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- getTask ---
  it('getTask should send a GET request and return Task', () => {
    const taskId = 1;
    const mockTask: Task = { id: 1, nom: 'T1', description: 'D1', status: 'TODO', priorite: 'LOW', projectId: 1, dateFin: new Date('2024-12-31'), dateEcheance: new Date() };

    service.getTask(taskId).subscribe(task => {
      expect(task).toEqual(mockTask);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/task/${taskId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockTask);
  });

  it('getTask should handle errors', () => {
    const taskId = 1;
    const mockError = new HttpErrorResponse({ status: 404, statusText: 'Not Found', error: { error: ErrorApi } });

    service.getTask(taskId).subscribe({
      next: () => fail('should have failed with the 404 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/task/${taskId}`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- createTask ---
  it('createTask should send a POST request and return Task', () => {
    const mockTaskRequest: Partial<Task> = { nom: 'New Task', projectId: 1 };
    const mockTaskResponse: Task = { id: 2, nom: 'New Task', description: '', status: 'TODO', priorite: 'LOW', projectId: 1, dateFin: new Date('2024-12-31'), dateEcheance: new Date() };

    service.createTask(mockTaskRequest).subscribe(task => {
      expect(task).toEqual(mockTaskResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/task`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockTaskRequest);
    req.flush(mockTaskResponse);
  });

  it('createTask should handle errors', () => {
    const mockTaskRequest: Partial<Task> = { nom: 'New Task', projectId: 1 };
    const mockError = new HttpErrorResponse({ status: 400, statusText: 'Bad Request', error: { error: ErrorApi } });

    service.createTask(mockTaskRequest).subscribe({
      next: () => fail('should have failed with the 400 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(400);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/task`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- updateTask ---
  it('updateTask should send a PUT request and return Task', () => {
    const mockTaskRequest: Task = { id: 1, nom: 'Updated Task', description: 'Desc', status: 'DONE', priorite: 'HIGH', projectId: 1, dateFin: new Date('2024-12-31'), dateEcheance: new Date() };
    const mockTaskResponse: Task = { id: 1, nom: 'Updated Task', description: 'Desc', status: 'DONE', priorite: 'HIGH', projectId: 1, dateFin: new Date('2024-12-31'), dateEcheance: new Date() };

    service.updateTask(mockTaskRequest).subscribe(task => {
      expect(task).toEqual(mockTaskResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/task`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(mockTaskRequest);
    req.flush(mockTaskResponse);
  });

  it('updateTask should handle errors', () => {
    const mockTaskRequest: Task = { id: 1, nom: 'Updated Task', description: 'Desc', status: 'DONE', priorite: 'HIGH', projectId: 1, dateFin: new Date('2024-12-31'), dateEcheance: new Date() };
    const mockError = new HttpErrorResponse({ status: 400, statusText: 'Bad Request', error: { error: ErrorApi } });

    service.updateTask(mockTaskRequest).subscribe({
      next: () => fail('should have failed with the 400 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(400);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/task`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- deleteTask ---
  it('deleteTask should send a DELETE request', () => {
    const taskId = 1;

    service.deleteTask(taskId).subscribe();

    const req = httpTestingController.expectOne(`${apiUrl}/task/${taskId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });

  it('deleteTask should handle errors', () => {
    const taskId = 1;
    const mockError = new HttpErrorResponse({ status: 404, statusText: 'Not Found', error: { error: ErrorApi } });

    service.deleteTask(taskId).subscribe({
      next: () => fail('should have failed with the 404 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/task/${taskId}`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- postUsersProject ---
  it('postUsersProject should send a POST request and return UsersProject', () => {
    const mockUsersProjectData: UsersProject = { projectId: 1, users: [{ id: 1, userId: 1, role: 'ADMIN' }] };
    const mockResponse: UsersProject = { ...mockUsersProjectData };

    service.postUsersProject(mockUsersProjectData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/project/user`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockUsersProjectData);
    req.flush(mockResponse);
  });

  it('postUsersProject should handle errors', () => {
    const mockUsersProjectData: UsersProject = { projectId: 1, users: [{ id: 1, userId: 1, role: 'ADMIN' }] };
    const mockError = new HttpErrorResponse({ status: 400, statusText: 'Bad Request', error: { error: ErrorApi } });

    service.postUsersProject(mockUsersProjectData).subscribe({
      next: () => fail('should have failed with the 400 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(400);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/project/user`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- getUsersProject ---
  it('getUsersProject should send a GET request and return UsersProject', () => {
    const projectId = 1;
    const mockResponse: UsersProject = { projectId: 1, users: [{ id: 1, userId: 1, role: 'ADMIN' }] };

    service.getUsersProject(projectId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/project/user/list/${projectId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('getUsersProject should handle errors', () => {
    const projectId = 1;
    const mockError = new HttpErrorResponse({ status: 404, statusText: 'Not Found', error: { message: ErrorApi } });

    service.getUsersProject(projectId).subscribe({
      next: () => fail('should have failed with the 404 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/project/user/list/${projectId}`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- deleteUserProject ---
  it('deleteUserProject should send a DELETE request', () => {
    const userProjectId = 1;

    service.deleteUserProject(userProjectId).subscribe();

    const req = httpTestingController.expectOne(`${apiUrl}/project/user/${userProjectId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });

  it('deleteUserProject should handle errors', () => {
    const userProjectId = 1;
    const mockError = new HttpErrorResponse({ status: 404, statusText: 'Not Found', error: { message: ErrorApi } });

    service.deleteUserProject(userProjectId).subscribe({
      next: () => fail('should have failed with the 404 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/project/user/${userProjectId}`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- assignTaskToUser ---
  it('assignTaskToUser should send a POST request', () => {
    const taskId = 1;
    const userId = 2;

    service.assignTaskToUser(taskId, userId).subscribe();

    const req = httpTestingController.expectOne(`${apiUrl}/assign/${taskId}/${userId}`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({});
    req.flush(null);
  });

  it('assignTaskToUser should handle errors', () => {
    const taskId = 1;
    const userId = 2;
    const mockError = new HttpErrorResponse({ status: 400, statusText: 'Bad Request', error: { error: ErrorApi } });

    service.assignTaskToUser(taskId, userId).subscribe({
      next: () => fail('should have failed with the 400 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(400);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/assign/${taskId}/${userId}`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- getAllAssigned ---
  it('getAllAssigned should send a GET request and return Assigned[]', () => {
    const taskId = 1;
    const mockAssigned: Assigned[] = [{ id: 1, userId: 1, taskId: 1, username: 'U1' }];

    service.getAllAssigned(taskId).subscribe(assigned => {
      expect(assigned).toEqual(mockAssigned);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/assign/${taskId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockAssigned);
  });

  it('getAllAssigned should handle errors', () => {
    const taskId = 1;
    const mockError = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });

    service.getAllAssigned(taskId).subscribe({
      next: () => fail('should have failed with the 500 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(500);
        expect(window.alert).toHaveBeenCalled();
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/assign/${taskId}`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- unassignTaskFromUser ---
  it('unassignTaskFromUser should send a DELETE request', () => {
    const assignId = 1;

    service.unassignTaskFromUser(assignId).subscribe();

    const req = httpTestingController.expectOne(`${apiUrl}/assign/${assignId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });

  it('unassignTaskFromUser should handle errors', () => {
    const assignId = 1;
    const mockError = new HttpErrorResponse({ status: 404, statusText: 'Not Found', error: { error: ErrorApi } });

    service.unassignTaskFromUser(assignId).subscribe({
      next: () => fail('should have failed with the 404 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual(ErrorApi);
        expect(window.alert).toHaveBeenCalledWith(`Erreur API: ${ErrorApi}`);
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/assign/${assignId}`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- getUsersByProjectId ---
  it('getUsersByProjectId should send a GET request and return User[]', () => {
    const projectId = 1;
    const mockUsers: User[] = [{ id: 1, nom: 'PUser1', email: 'puser1@e.com' }];

    service.getUsersByProjectId(projectId).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/user/project/${projectId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockUsers);
  });

  it('getUsersByProjectId should handle errors', () => {
    const projectId = 1;
    const mockError = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });

    service.getUsersByProjectId(projectId).subscribe({
      next: () => fail('should have failed with the 500 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(500);
        expect(window.alert).toHaveBeenCalled();
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/user/project/${projectId}`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- getHistoriqueForProject ---
  it('getHistoriqueForProject should send a GET request and return Historique[]', () => {
    const projectId = 1;
    const mockHistorique: Historique[] = [{ id: 1, oldString: 'Old', newString: 'New', dateM: new Date(), user: { id: 1, nom: 'U1', email: 'u1@e.com' }, typeM: 0 }];

    service.getHistoriqueForProject(projectId).subscribe(history => {
      expect(history).toEqual(mockHistorique);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/historique/project/${projectId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockHistorique);
  });

  it('getHistoriqueForProject should handle errors', () => {
    const projectId = 1;
    const mockError = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });

    service.getHistoriqueForProject(projectId).subscribe({
      next: () => fail('should have failed with the 500 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(500);
        expect(window.alert).toHaveBeenCalled();
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/historique/project/${projectId}`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- getHistoriqueForTask ---
  it('getHistoriqueForTask should send a GET request and return Historique[]', () => {
    const taskId = 1;
    const mockHistorique: Historique[] = [{ id: 1, oldString: 'Old', newString: 'New', dateM: new Date(), user: { id: 1, nom: 'U1', email: 'u1@e.com' }, typeM: 0 }];

    service.getHistoriqueForTask(taskId).subscribe(history => {
      expect(history).toEqual(mockHistorique);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/historique/task/${taskId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockHistorique);
  });

  it('getHistoriqueForTask should handle errors', () => {
    const taskId = 1;
    const mockError = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });

    service.getHistoriqueForTask(taskId).subscribe({
      next: () => fail('should have failed with the 500 error'),
      error: (error: ApiError) => {
        expect(error.status).toEqual(500);
        expect(window.alert).toHaveBeenCalled();
      }
    });

    const req = httpTestingController.expectOne(`${apiUrl}/historique/task/${taskId}`);
    req.error(new ErrorEvent('Network error'), mockError);
  });

  // --- catchError handler ---
  it('catchError should handle HttpErrorResponse with no specific error details', () => {
    const httpError = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      url: 'http://someurl'
    });

    let caughtError: ApiError | undefined;
    service.catchError(httpError).subscribe({
      next: () => fail('should have thrown an error'),
      error: (err: ApiError) => { caughtError = err; }
    });

    expect(caughtError).toBeDefined();
    expect(caughtError?.status).toBe(500);
    expect(caughtError?.details).toBe("Aucune information sur l'erreur");
    expect(window.alert).toHaveBeenCalledWith(`Erreur API: Une erreur inconnue s'est produite`);
  });
});
