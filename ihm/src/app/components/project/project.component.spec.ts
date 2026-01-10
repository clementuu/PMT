import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProjectComponent } from './project.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Historique } from '../../models/historique.model';
import { ProjectUpdatePayload } from '../../models/project-update.model';

// Mock child components
@Component({ selector: 'app-historique', template: '' })
class MockHistoriqueComponent {
  @Input() projectId?: number;
  @Input() taskId?: number;
  historiques: Historique[] = [];
  loadHistory = jasmine.createSpy('loadHistory');
}

@Component({ selector: 'app-user-project', template: '' })
class MockUserProjectComponent {
  @Input() allUsers: User[] = [];
  @Input() availableRoles: string[] = [];
  @Input() projectId: number = 0;
  @Input() editing: boolean = false;
  loadParticipants = jasmine.createSpy('loadParticipants');
}

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;
  let mockActivatedRoute: any;
  let mockApiService: any;
  let mockAuthService: any;
  let mockRouter: any;
  let formBuilder: FormBuilder;

  let mockHistoriqueComponentInstance: MockHistoriqueComponent;
  let mockUserProjectComponentInstance: MockUserProjectComponent;

  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com' };
  const mockProject: Project = {
    id: 101,
    nom: 'Test Project',
    description: 'Project Description',
    dateFin: new Date('2024-12-31'),
    tasks: [
      { id: 1, nom: 'Task 1', status: 'TODO', projectId: 101 } as Task,
      { id: 2, nom: 'Task 2', status: 'IN_PROGRESS', projectId: 101 } as Task,
      { id: 3, nom: 'Task 3', status: 'DONE', projectId: 101 } as Task,
    ],
  };
  const mockAllUsers: User[] = [
    { id: 1, nom: 'User A', email: 'a@example.com' },
    { id: 2, nom: 'User B', email: 'b@example.com' },
  ];

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => (key === 'id' ? '101' : null),
        },
      },
    };
    mockApiService = {
      getProjectById: jasmine.createSpy('getProjectById').and.returnValue(of(mockProject)),
      getAllUsers: jasmine.createSpy('getAllUsers').and.returnValue(of(mockAllUsers)),
      updateProject: jasmine.createSpy('updateProject').and.returnValue(of(mockProject)),
      deleteProject: jasmine.createSpy('deleteProject').and.returnValue(of(void 0)),
      updateTask: jasmine.createSpy('updateTask').and.returnValue(of({})), // For drop method
      getUsersProject: jasmine.createSpy('getUsersProject').and.returnValue(of({ users: [] })),
      getHistoriqueForProject: jasmine.createSpy('getHistoriqueForProject').and.returnValue(of([])),
    };
    mockAuthService = {
      user: mockUser,
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, ProjectComponent, MockHistoriqueComponent, MockUserProjectComponent], // Import ProjectComponent as it's standalone
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    
    // Spy on the private loadProjectData method
    spyOn(component as any, 'loadProjectData').and.callThrough();

    fixture.detectChanges(); // Initial change detection
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load project data on ngOnInit', fakeAsync(() => {
    component.ngOnInit(); // Explicitly call ngOnInit after mocks are set
    tick(); // Simulate passage of time for async operations

    expect(component['loadProjectData']).toHaveBeenCalledWith(101); // Check private method call
    expect(mockApiService.getProjectById).toHaveBeenCalledWith(101);
    expect(component.project).toEqual(mockProject);
    expect(component.todoTasks.length).toBe(1);
    expect(component.inProgressTasks.length).toBe(1);
    expect(component.doneTasks.length).toBe(1);
    expect(mockApiService.getAllUsers).toHaveBeenCalled();
    expect(component.allUsers).toEqual(mockAllUsers);
  }));

  it('should start editing and patch the form with project data', () => {
    component.project = mockProject;
    component.startEditing();
    expect(component.isEditing).toBeTrue();
    expect(component.projectForm.value.nom).toEqual(mockProject.nom);
    expect(component.projectForm.value.description).toEqual(mockProject.description);
  });

  it('should cancel editing', () => {
    component.isEditing = true;
    component.cancelEdit();
    expect(component.isEditing).toBeFalse();
  });

  it('should update project and reload data on success', fakeAsync(() => {
    component.project = mockProject;
    component.isEditing = true;
    component.projectForm.patchValue({ nom: 'Updated Project Name' });

    component.updateProject();
    tick();

    expect(mockApiService.updateProject).toHaveBeenCalledWith({
      project: { ...mockProject, nom: 'Updated Project Name' },
      userId: mockUser.id,
    } as ProjectUpdatePayload);
    expect(component.isEditing).toBeFalse();
    expect(component['loadProjectData']).toHaveBeenCalledWith(mockProject.id); // Check private method call
  }));

  it('should not update project if user is not logged in', () => {
    mockAuthService.user = null;
    component.project = mockProject;
    component.isEditing = true;
    component.projectForm.patchValue({ nom: 'Updated Project Name' });

    spyOn(window, 'alert'); // Spy on alert
    component.updateProject();

    expect(mockApiService.updateProject).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Vous devez être connecté pour mettre à jour un projet.');
  });

  it('should not update project if form is invalid', () => {
    component.project = mockProject;
    component.isEditing = true;
    component.projectForm.patchValue({ nom: '' }); // Make form invalid

    spyOn(window, 'alert'); // Spy on alert
    component.updateProject();

    expect(mockApiService.updateProject).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Le formulaire est invalide.');
  });

  it('should delete project and navigate to dashboard on confirmation', fakeAsync(() => {
    component.project = mockProject;
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');

    component.deleteProject();
    tick();

    expect(window.confirm).toHaveBeenCalledWith('Voulez vous supprimer ce projet ?');
    expect(mockApiService.deleteProject).toHaveBeenCalledWith(mockProject.id);
    expect(window.alert).toHaveBeenCalledWith('Projet supprimé !');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should not delete project if not confirmed', fakeAsync(() => {
    component.project = mockProject;
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(window, 'alert');

    component.deleteProject();
    tick();

    expect(window.confirm).toHaveBeenCalledWith('Voulez vous supprimer ce projet ?');
    expect(mockApiService.deleteProject).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));

  it('should navigate to task detail', () => {
    component.goToTaskDetail(123);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/task', 123]);
  });

  it('should navigate to new task creation', () => {
    component.project = mockProject;
    component.goToNewTask();
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/project/${mockProject.id}/new-task`]);
  });

  it('should handle task drag and drop to a different container (status change)', fakeAsync(() => {
    component.project = mockProject;
    component.todoTasks = [{ id: 1, nom: 'Task 1', status: 'TODO', projectId: 101 } as Task];
    component.inProgressTasks = [];

    const event: CdkDragDrop<Task[]> = {
      previousContainer: { data: component.todoTasks, id: 'TODO' } as any,
      container: { data: component.inProgressTasks, id: 'IN_PROGRESS' } as any,
      previousIndex: 0,
      currentIndex: 0,
      item: { data: component.todoTasks[0] } as any, // Mock item data
      isPointerOverContainer: true,
      distance: {x: 0, y: 0},
      dropPoint: {x: 0, y: 0}, // Added missing property
      event: {} as MouseEvent // Changed to MouseEvent
    };

    component.drop(event);
    tick();

    expect(component.todoTasks.length).toBe(0);
    expect(component.inProgressTasks.length).toBe(1);
    expect(component.inProgressTasks[0].status).toBe('IN_PROGRESS');
    expect(mockApiService.updateTask).toHaveBeenCalled();
  }));

  it('should handle task drag and drop within the same container', () => {
    component.todoTasks = [
      { id: 1, nom: 'Task 1', status: 'TODO', projectId: 101 } as Task,
      { id: 2, nom: 'Task 2', status: 'TODO', projectId: 101 } as Task,
    ];

    const container = { data: component.todoTasks, id: 'TODO' } as any;

    const event: CdkDragDrop<Task[]> = {
      previousContainer: container,
      container: container,
      previousIndex: 0,
      currentIndex: 1,
      item: { data: component.todoTasks[0] } as any, // Mock item data
      isPointerOverContainer: true,
      distance: {x: 0, y: 0},
      dropPoint: {x: 0, y: 0}, // Added missing property
      event: {} as MouseEvent // Changed to MouseEvent
    };

    component.drop(event);

    expect(component.todoTasks[0].id).toBe(2);
    expect(component.todoTasks[1].id).toBe(1);
    expect(mockApiService.updateTask).not.toHaveBeenCalled();
  });
});
