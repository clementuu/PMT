import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

import { TaskAssignComponent } from './task-assign.component';
import { ApiService } from '../../services/api.service';
import { User, Assigned } from '../../models/user.model';
import { By } from '@angular/platform-browser';

describe('TaskAssignComponent', () => {
  let component: TaskAssignComponent;
  let fixture: ComponentFixture<TaskAssignComponent>;
  let mockApiService: any;

  const mockProjectUsers: User[] = [
    { id: 1, nom: 'User A', email: 'a@example.com' },
    { id: 2, nom: 'User B', email: 'b@example.com' },
  ];
  const mockAssignedUsers: Assigned[] = [
    { id: 101, userId: 1, taskId: 1, username: 'User A' },
  ];

  beforeEach(async () => {
    mockApiService = {
      // Start with empty arrays to test population and error cases cleanly
      getUsersByProjectId: jasmine.createSpy('getUsersByProjectId').and.returnValue(of([])),
      getAllAssigned: jasmine.createSpy('getAllAssigned').and.returnValue(of([])),
      assignTaskToUser: jasmine.createSpy('assignTaskToUser').and.returnValue(of({})),
      unassignTaskFromUser: jasmine.createSpy('unassignTaskFromUser').and.returnValue(of(void 0))
    };

    await TestBed.configureTestingModule({
      imports: [TaskAssignComponent, FormsModule], // Ensure FormsModule is imported
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Initialization Tests ---
  it('should call loadProjectUsers and loadAssignedUsers on ngOnInit', fakeAsync(() => {
    // Reset spies from beforeEach's ngOnInit call
    mockApiService.getUsersByProjectId.calls.reset();
    mockApiService.getAllAssigned.calls.reset();

    spyOn(component, 'loadProjectUsers');
    spyOn(component, 'loadAssignedUsers');
    component.ngOnInit();
    tick();
    expect(component.loadProjectUsers).toHaveBeenCalled();
    expect(component.loadAssignedUsers).toHaveBeenCalled();
  }));

  // --- loadProjectUsers Tests ---
  it('should load project users on successful API call', fakeAsync(() => {
    mockApiService.getUsersByProjectId.and.returnValue(of(mockProjectUsers)); // Set mock for this test
    component.loadProjectUsers();
    tick();
    expect(mockApiService.getUsersByProjectId).toHaveBeenCalledWith(component.projectId);
    expect(component.users).toEqual(mockProjectUsers);
  }));

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

  // --- loadAssignedUsers Tests ---
  it('should load assigned users on successful API call with taskId', fakeAsync(() => {
    mockApiService.getAllAssigned.and.returnValue(of(mockAssignedUsers)); // Set mock for this test
    component.taskId = 10;
    component.loadAssignedUsers();
    tick();
    expect(mockApiService.getAllAssigned).toHaveBeenCalledWith(component.taskId);
    expect(component.assigned).toEqual(mockAssignedUsers);
  }));

  it('should not call getAllAssigned if taskId is not set', fakeAsync(() => {
    mockApiService.getAllAssigned.calls.reset(); // Clear previous calls from ngOnInit
    component.taskId = undefined as any; // Explicitly set to undefined for test
    component.loadAssignedUsers(); // Call the method
    tick();
    expect(mockApiService.getAllAssigned).not.toHaveBeenCalled();
    expect(component.assigned).toEqual([]); // Should remain empty
  }));

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

  // --- assignTask Tests ---
  it('should assign task to user on successful API call', fakeAsync(() => {
    spyOn(component.taskAssigned, 'emit');
    spyOn(component, 'loadAssignedUsers');
    spyOn(component, 'loadProjectUsers');
    component.selectedUserId = 2; // User B
    const userIdToAssign = component.selectedUserId; // Capture the value before it's reset

    component.assignTask();
    tick();

    expect(mockApiService.assignTaskToUser).toHaveBeenCalledWith(component.taskId, userIdToAssign);
    expect(component.taskAssigned.emit).toHaveBeenCalled();
    expect(component.selectedUserId).toBeUndefined(); // This assertion is correct and should pass now
    expect(component.loadAssignedUsers).toHaveBeenCalled();
    expect(component.loadProjectUsers).toHaveBeenCalled();
  }));

  it('should alert and not call API if no user is selected for assignment', () => {
    spyOn(window, 'alert');
    component.selectedUserId = undefined;

    component.assignTask();

    expect(window.alert).toHaveBeenCalledWith('Please select a user to assign the task.');
    expect(mockApiService.assignTaskToUser).not.toHaveBeenCalled();
  });

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


  // --- unassignUser Tests ---
  it('should unassign user on successful API call', fakeAsync(() => {
    spyOn(component, 'loadAssignedUsers');
    spyOn(component, 'loadProjectUsers');
    const assignedUserId = 101; // ID of Assigned object

    component.unassignUser(assignedUserId);
    tick();

    expect(mockApiService.unassignTaskFromUser).toHaveBeenCalledWith(assignedUserId);
    expect(component.loadAssignedUsers).toHaveBeenCalled();
    expect(component.loadProjectUsers).toHaveBeenCalled();
  }));

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

  // --- Template Rendering Tests ---
  it('should display "Aucun utilisateur assigné" message when no users are assigned', () => {
    component.assigned = [];
    fixture.detectChanges();
    const noUsersMessage = fixture.debugElement.query(By.css('.no-users'));
    expect(noUsersMessage).toBeTruthy();
    expect(noUsersMessage.nativeElement.textContent).toContain('Aucun utilisateur assigné pour le moment.');
  });

  it('should display assigned users in the template', () => {
    component.assigned = mockAssignedUsers;
    fixture.detectChanges();
    const assignedUserTags = fixture.debugElement.queryAll(By.css('.user-tag'));
    expect(assignedUserTags.length).toBe(mockAssignedUsers.length);
    expect(assignedUserTags[0].nativeElement.textContent).toContain(mockAssignedUsers[0].username);
  });

  it('should display project users in the select dropdown', fakeAsync(() => {
    component.users = mockProjectUsers;
    fixture.detectChanges();
    tick(); // Ensure template updates

    const options = fixture.debugElement.queryAll(By.css('select option'));
    // +1 for the disabled "Sélectionner un utilisateur" option
    expect(options.length).toBe(mockProjectUsers.length + 1); 
    expect(options[1].nativeElement.textContent).toContain(mockProjectUsers[0].nom);
    expect(options[2].nativeElement.textContent).toContain(mockProjectUsers[1].nom);
  }));
});
