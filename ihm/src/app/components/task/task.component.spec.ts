import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TaskComponent } from './task.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { CommonModule, formatDate } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({ selector: 'app-task-assign', template: '' })
class MockTaskAssignComponent {
  @Input() taskId!: number;
  @Input() projectId!: number;
  @Output() taskAssigned = new EventEmitter<void>();
}

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let mockActivatedRoute: any;
  let mockApiService: any;
  let mockAuthService: any;
  let mockRouter: any;

  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com' };

  const mockTask: Task = {
    id: 1,
    nom: 'Test Task',
    description: 'Task Description',
    dateFin: new Date(),
    dateEcheance: new Date('2024-12-31'),
    priorite: 'MEDIUM',
    status: 'TODO',
    projectId: 101,
  };

  beforeEach(async () => {
    mockActivatedRoute = {
      paramMap: of({ get: (key: string) => (key === 'id' ? '1' : null) })
    };

    mockApiService = {
      getTask: jasmine.createSpy('getTask').and.returnValue(of(mockTask)),
      updateTask: jasmine.createSpy('updateTask').and.returnValue(of(mockTask)),
      deleteTask: jasmine.createSpy('deleteTask').and.returnValue(of(void 0)),
      getUsersByProjectId: jasmine.createSpy('getUsersByProjectId').and.returnValue(of([])),
      getAllAssigned: jasmine.createSpy('getAllAssigned').and.returnValue(of([])),
      assignTaskToUser: jasmine.createSpy('assignTaskToUser').and.returnValue(of({})),
      unassignTaskFromUser: jasmine.createSpy('unassignTaskFromUser').and.returnValue(of(void 0)),
      getHistoriqueForTask: jasmine.createSpy('getHistoriqueForTask').and.returnValue(of([])),
      getUsersProject: jasmine.createSpy('getUsersProject').and.returnValue(of({ users: [] })),
    };

    mockAuthService = { user: mockUser };
    mockRouter = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [
        TaskComponent,
        CommonModule,
        ReactiveFormsModule,
        MockTaskAssignComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load task on ngOnInit', () => {
    expect(mockApiService.getTask).toHaveBeenCalledWith(1);
    expect(component.task).toEqual(mockTask);
  });

  it('should call loadTask on onTaskAssigned', () => {
    spyOn(component, 'loadTask').and.callThrough();
    component.onTaskAssigned();
    expect(component.loadTask).toHaveBeenCalled();
  });

  it('should start editing and populate the form', () => {
    component.task = mockTask;
    component.startEditing();

    expect(component.isEditing).toBeTrue();
    expect(component.taskForm.value.nom).toEqual(mockTask.nom);
    expect(component.taskForm.value.description).toEqual(mockTask.description);
    expect(component.taskForm.value.dateEcheance).toEqual(formatDate(mockTask.dateEcheance, 'yyyy-MM-dd', 'en'));
    expect(component.taskForm.value.priorite).toEqual(mockTask.priorite);
    expect(component.taskForm.value.status).toEqual(mockTask.status);
  });

  it('should cancel editing', () => {
    component.isEditing = true;
    component.cancelEdit();
    expect(component.isEditing).toBeFalse();
  });

  it('should update task', () => {
    component.task = mockTask;
    component.startEditing();
    component.taskForm.patchValue({ nom: 'Updated Task Name' });

    spyOn(component, 'loadTask').and.callThrough();

    component.updateTask();

    expect(mockApiService.updateTask).toHaveBeenCalled();

    const callArgs = mockApiService.updateTask.calls.first().args[0];
    expect(callArgs.nom).toEqual('Updated Task Name');
    expect(callArgs.userId).toEqual(mockUser.id);

    expect(component.isEditing).toBeFalse();
    expect(component.loadTask).toHaveBeenCalled();
  });

  it('should delete task and navigate to project page', () => {
    component.task = mockTask;
    component.deleteTask();

    expect(mockApiService.deleteTask).toHaveBeenCalledWith(mockTask.id);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/project/${mockTask.projectId}`]);
  });

  it('should not delete task if task is null', () => {
    component.task = null;
    component.deleteTask();
    expect(mockApiService.deleteTask).not.toHaveBeenCalled();
  });

  it('should return correct priority display name', () => {
    expect(component.getPriorityDisplayName('LOW')).toBe('Faible');
    expect(component.getPriorityDisplayName('MEDIUM')).toBe('Moyenne');
    expect(component.getPriorityDisplayName('HIGH')).toBe('Importante');
    expect(component.getPriorityDisplayName('UNKNOWN')).toBe('UNKNOWN');
  });

  it('should return correct status display name', () => {
    expect(component.getStatusDisplayName('TODO')).toBe('À faire');
    expect(component.getStatusDisplayName('IN_PROGRESS')).toBe('En cours');
    expect(component.getStatusDisplayName('DONE')).toBe('Terminé');
    expect(component.getStatusDisplayName('UNKNOWN')).toBe('UNKNOWN');
  });
});