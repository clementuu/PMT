import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

import { TaskAssignComponent } from './task-assign.component';
import { ApiService } from '../../services/api.service';
import { User, Assigned } from '../../models/user.model';
import { By } from '@angular/platform-browser';

/**
 * Suite de tests pour le composant TaskAssignComponent.
 */
describe('TaskAssignComponent', () => {
  /**
   * Instance du composant TaskAssignComponent.
   */
  let component: TaskAssignComponent;
  /**
   * Fixture du composant pour les tests.
   */
  let fixture: ComponentFixture<TaskAssignComponent>;
  /**
   * Service API mocké.
   */
  let mockApiService: any;

  /**
   * Utilisateurs de projet mockés pour les tests.
   */
  const mockProjectUsers: User[] = [
    { id: 1, nom: 'User A', email: 'a@example.com' },
    { id: 2, nom: 'User B', email: 'b@example.com' },
  ];
  /**
   * Utilisateurs assignés mockés pour les tests.
   */
  const mockAssignedUsers: Assigned[] = [
    { id: 101, userId: 1, taskId: 1, username: 'User A' },
  ];

  /**
   * Configure l'environnement de test avant chaque test.
   */
  beforeEach(async () => {
    mockApiService = {
      // Start with empty arrays to test population and error cases cleanly
      getUsersByProjectId: jasmine.createSpy('getUsersByProjectId').and.returnValue(of([])),
      getAllAssigned: jasmine.createSpy('getAllAssigned').and.returnValue(of([])),
      assignTaskToUser: jasmine.createSpy('assignTaskToUser').and.returnValue(of({})),
      unassignTaskFromUser: jasmine.createSpy('unassignTaskFromUser').and.returnValue(of(void 0))
    };

    await TestBed.configureTestingModule({
      imports: [TaskAssignComponent, FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: mockApiService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAssignComponent);
    component = fixture.componentInstance;
    component.projectId = 1; // Set required input
    component.taskId = 10; // Set required input
    fixture.detectChanges();
  });

  /**
   * Vérifie si le composant est créé avec succès.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Teste que `loadProjectUsers` et `loadAssignedUsers` sont appelés lors de l'initialisation du composant.
   */
  it('should call loadProjectUsers and loadAssignedUsers on ngOnInit', fakeAsync(() => {
    mockApiService.getUsersByProjectId.calls.reset();
    mockApiService.getAllAssigned.calls.reset();

    spyOn(component, 'loadProjectUsers');
    spyOn(component, 'loadAssignedUsers');
    component.ngOnInit();
    tick();
    expect(component.loadProjectUsers).toHaveBeenCalled();
    expect(component.loadAssignedUsers).toHaveBeenCalled();
  }));

  /**
   * Teste le chargement des utilisateurs du projet en cas de succès de l'appel API.
   */
  it('should load project users on successful API call', fakeAsync(() => {
    mockApiService.getUsersByProjectId.and.returnValue(of(mockProjectUsers));
    component.loadProjectUsers();
    tick();
    expect(mockApiService.getUsersByProjectId).toHaveBeenCalledWith(component.projectId);
    expect(component.users).toEqual(mockProjectUsers);
  }));

  /**
   * Teste l'enregistrement d'une erreur si l'appel API `loadProjectUsers` échoue.
   */
  it('should log error if loadProjectUsers API fails', fakeAsync(() => {
    const errorResponse = new Error('Failed to fetch users');
    mockApiService.getUsersByProjectId.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');

    component.loadProjectUsers();
    tick();

    expect(mockApiService.getUsersByProjectId).toHaveBeenCalledWith(component.projectId);
    expect(console.error).toHaveBeenCalledWith('Failed to fetch users', errorResponse);
    expect(component.users).toEqual([]);
  }));

  /**
   * Teste le chargement des utilisateurs assignés en cas de succès de l'appel API avec un `taskId`.
   */
  it('should load assigned users on successful API call with taskId', fakeAsync(() => {
    mockApiService.getAllAssigned.and.returnValue(of(mockAssignedUsers));
    component.taskId = 10;
    component.loadAssignedUsers();
    tick();
    expect(mockApiService.getAllAssigned).toHaveBeenCalledWith(component.taskId);
    expect(component.assigned).toEqual(mockAssignedUsers);
  }));

  /**
   * Teste que `getAllAssigned` n'est pas appelé si `taskId` n'est pas défini.
   */
  it('should not call getAllAssigned if taskId is not set', fakeAsync(() => {
    mockApiService.getAllAssigned.calls.reset();
    component.taskId = undefined as any;
    component.loadAssignedUsers();
    tick();
    expect(mockApiService.getAllAssigned).not.toHaveBeenCalled();
    expect(component.assigned).toEqual([]);
  }));

  /**
   * Teste l'enregistrement d'une erreur si l'appel API `loadAssignedUsers` échoue.
   */
  it('should log error if loadAssignedUsers API fails', fakeAsync(() => {
    component.taskId = 10;
    const errorResponse = new Error('Failed to get assigned users');
    mockApiService.getAllAssigned.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');

    component.loadAssignedUsers();
    tick();

    expect(mockApiService.getAllAssigned).toHaveBeenCalledWith(component.taskId);
    expect(console.error).toHaveBeenCalledWith("getting assigned", errorResponse);
    expect(component.assigned).toEqual([]);
  }));

  /**
   * Teste l'assignation d'une tâche à un utilisateur en cas de succès de l'appel API.
   */
  it('should assign task to user on successful API call', fakeAsync(() => {
    spyOn(component.taskAssigned, 'emit');
    spyOn(component, 'loadAssignedUsers');
    spyOn(component, 'loadProjectUsers');
    component.selectedUserId = 2;
    const userIdToAssign = component.selectedUserId;

    component.assignTask();
    tick();

    expect(mockApiService.assignTaskToUser).toHaveBeenCalledWith(component.taskId, userIdToAssign);
    expect(component.taskAssigned.emit).toHaveBeenCalled();
    expect(component.selectedUserId).toBeUndefined();
    expect(component.loadAssignedUsers).toHaveBeenCalled();
    expect(component.loadProjectUsers).toHaveBeenCalled();
  }));

  /**
   * Teste qu'une alerte est affichée et que l'API n'est pas appelée si aucun utilisateur n'est sélectionné pour l'assignation.
   */
  it('should alert and not call API if no user is selected for assignment', () => {
    spyOn(window, 'alert');
    component.selectedUserId = undefined;

    component.assignTask();

    expect(window.alert).toHaveBeenCalledWith('Please select a user to assign the task.');
    expect(mockApiService.assignTaskToUser).not.toHaveBeenCalled();
  });

  /**
   * Teste qu'une alerte est affichée et qu'une erreur est enregistrée si l'appel API `assignTask` échoue.
   */
  it('should alert and log error if assignTask API fails', fakeAsync(() => {
    const errorResponse = new Error('Assignment failed');
    mockApiService.assignTaskToUser.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');
    spyOn(window, 'alert');
    component.selectedUserId = 2;

    component.assignTask();
    tick();

    expect(mockApiService.assignTaskToUser).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Failed to assign task', errorResponse);
    expect(window.alert).toHaveBeenCalledWith('Failed to assign task: ' + errorResponse.message);
  }));

  /**
   * Teste si le bouton d'assignation est désactivé si aucun utilisateur n'est sélectionné.
   */
  it('should disable assign button if no user is selected', fakeAsync(() => {
    component.selectedUserId = undefined;
    fixture.detectChanges();
    tick();
    const assignButton = fixture.debugElement.query(By.css('.btn.btn-primary')).nativeElement;
    expect(assignButton.disabled).toBe(true);

    component.selectedUserId = 1;
    fixture.detectChanges();
    tick();
    expect(assignButton.disabled).toBe(false);
  }));

  /**
   * Teste la désassignation d'un utilisateur en cas de succès de l'appel API.
   */
  it('should unassign user on successful API call', fakeAsync(() => {
    spyOn(component, 'loadAssignedUsers');
    spyOn(component, 'loadProjectUsers');
    const assignedUserId = 101;

    component.unassignUser(assignedUserId);
    tick();

    expect(mockApiService.unassignTaskFromUser).toHaveBeenCalledWith(assignedUserId);
    expect(component.loadAssignedUsers).toHaveBeenCalled();
    expect(component.loadProjectUsers).toHaveBeenCalled();
  }));

  /**
   * Teste qu'une alerte est affichée et qu'une erreur est enregistrée si l'appel API `unassignUser` échoue.
   */
  it('should alert and log error if unassignUser API fails', fakeAsync(() => {
    const errorResponse = new Error('Unassignment failed');
    mockApiService.unassignTaskFromUser.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');
    spyOn(window, 'alert');
    const assignedUserId = 101;

    component.unassignUser(assignedUserId);
    tick();

    expect(mockApiService.unassignTaskFromUser).toHaveBeenCalledWith(assignedUserId);
    expect(console.error).toHaveBeenCalledWith('Failed to unassign user', errorResponse);
    expect(window.alert).toHaveBeenCalledWith('Failed to unassign user: ' + errorResponse.message);
  }));

  /**
   * Teste l'affichage du message "Aucun utilisateur assigné" lorsqu'aucun utilisateur n'est assigné.
   */
  it('should display "Aucun utilisateur assigné" message when no users are assigned', () => {
    component.assigned = [];
    fixture.detectChanges();
    const noUsersMessage = fixture.debugElement.query(By.css('.no-users'));
    expect(noUsersMessage).toBeTruthy();
    expect(noUsersMessage.nativeElement.textContent).toContain('Aucun utilisateur assigné pour le moment.');
  });

  /**
   * Teste l'affichage des utilisateurs assignés dans le template.
   */
  it('should display assigned users in the template', () => {
    component.assigned = mockAssignedUsers;
    fixture.detectChanges();
    const assignedUserTags = fixture.debugElement.queryAll(By.css('.user-tag'));
    expect(assignedUserTags.length).toBe(mockAssignedUsers.length);
    expect(assignedUserTags[0].nativeElement.textContent).toContain(mockAssignedUsers[0].username);
  });

  /**
   * Teste l'affichage des utilisateurs du projet dans la liste déroulante de sélection.
   */
  it('should display project users in the select dropdown', fakeAsync(() => {
    component.users = mockProjectUsers;
    fixture.detectChanges();
    tick();

    const options = fixture.debugElement.queryAll(By.css('select option'));
    expect(options.length).toBe(mockProjectUsers.length + 1);
    expect(options[1].nativeElement.textContent).toContain(mockProjectUsers[0].nom);
    expect(options[2].nativeElement.textContent).toContain(mockProjectUsers[1].nom);
  }));
});