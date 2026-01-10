import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TaskNewComponent } from './task-new.component';
import { ApiService } from '../../services/api.service';
import { Task } from '../../models/task.model';

describe('TaskNewComponent', () => {
  let component: TaskNewComponent;
  let fixture: ComponentFixture<TaskNewComponent>;
  let mockApiService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockTask: Task = { id: 1, nom: 'Test Task', description: 'Test Description', projectId: 1, dateFin: new Date(),dateEcheance: new Date(), priorite: "HIGH", status: "TODO" };

  beforeEach(async () => {
    mockApiService = {
      createTask: jasmine.createSpy('createTask').and.returnValue(of(mockTask))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    let paramMapId: string | null = '1'; // Default to '1' for most tests

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => paramMapId
        }
      }
    };

    // Spy on console.error to prevent it from logging during tests and allow assertions
    let consoleErrorSpy: jasmine.Spy;

    await TestBed.configureTestingModule({
      imports: [TaskNewComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values and validators', () => {
    expect(component.taskForm).toBeDefined();
    expect(component.taskForm.controls['nom'].value).toEqual('');
    expect(component.taskForm.controls['description'].value).toEqual('');
    expect(component.taskForm.controls['dateEcheance'].value).toEqual('');
    expect(component.taskForm.controls['priorite'].value).toEqual('MEDIUM');
    expect(component.taskForm.controls['nom'].valid).toBeFalsy();
    expect(component.taskForm.controls['description'].valid).toBeFalsy();
  });

  it('should get projectId from route params on ngOnInit', () => {
    expect(component.projectId).toEqual(1);
  });

  it('should navigate to dashboard if projectId is missing', () => {
    // Reconfigure mockActivatedRoute for this specific test
    mockActivatedRoute.snapshot.paramMap.get = (key: string) => null;
    const consoleErrorSpy = spyOn(console, 'error');

    // Re-initialize component to trigger ngOnInit with the new mock
    component.ngOnInit();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Project ID is missing!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should call createTask and navigate on valid form submission', () => {
    component.taskForm.controls['nom'].setValue('New Task');
    component.taskForm.controls['description'].setValue('New Description');
    component.taskForm.controls['dateEcheance'].setValue('2024-12-31');
    component.taskForm.controls['priorite'].setValue('HIGH');

    component.onSubmit();

    expect(mockApiService.createTask).toHaveBeenCalledWith({
      nom: 'New Task',
      description: 'New Description',
      dateEcheance: '2024-12-31',
      priorite: 'HIGH',
      projectId: 1,
      status: 'TODO'
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/project', 1]);
  });

  it('should not call createTask if the form is invalid', () => {
    component.taskForm.controls['nom'].setValue(''); // Make form invalid
    component.taskForm.controls['description'].setValue('Description'); // Set description
    component.onSubmit();
    expect(mockApiService.createTask).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should handle error when createTask fails', () => {
    const errorResponse = new Error('Error creating task');
    mockApiService.createTask.and.returnValue(throwError(() => errorResponse));
    const consoleErrorSpy = spyOn(console, 'error');

    component.taskForm.controls['nom'].setValue('New Task');
    component.taskForm.controls['description'].setValue('New Description');
    component.taskForm.controls['dateEcheance'].setValue('2024-12-31');
    component.taskForm.controls['priorite'].setValue('HIGH');

    component.onSubmit();

    expect(mockApiService.createTask).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating task:', errorResponse);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
