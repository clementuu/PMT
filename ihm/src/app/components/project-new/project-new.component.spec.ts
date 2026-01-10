import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ProjectNewComponent } from './project-new.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Project } from '../../models/project.model';
import { Router } from '@angular/router';
import { UserRole } from '../../models/userProject.model';

// Dummy component for router testing
@Component({ template: '' })
class DummyComponent { }

// Mock child component app-user-project
@Component({ selector: 'app-user-project', template: '' })
class MockUserProjectComponent {
  @Input() allUsers: User[] = [];
  @Input() availableRoles: string[] = [];
  @Input() editing: boolean = false;
  @Input() initialParticipantList: UserRole[] = [];

  // This output is not explicitly defined in the component, but we can mock it as an input for simplicity
  // Or spy on a method if the component communicates differently
  // For now, we'll assume the parent directly calls setParticipants
}


describe('ProjectNewComponent', () => {
  let component: ProjectNewComponent;
  let fixture: ComponentFixture<ProjectNewComponent>;
  let mockApiService: any;
  let mockAuthService: any;
  let router: Router; // Changed from mockRouter to router to inject the real router from RouterTestingModule

  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com' };
  const mockProject: Project = { id: 1, nom: 'Test Project', description: 'Test Description', tasks: [], dateFin: new Date('2024-12-31') };
  const mockAllUsers: User[] = [{ id: 1, nom: 'User1', email: 'user1@test.com' }, { id: 2, nom: 'User2', email: 'user2@test.com' }];


  beforeEach(async () => {
    mockApiService = {
      getAllUsers: jasmine.createSpy('getAllUsers').and.returnValue(of([])), // Default to empty for clean error testing
      createProject: jasmine.createSpy('createProject').and.returnValue(of(mockProject)),
      postUsersProject: jasmine.createSpy('postUsersProject').and.returnValue(of({}))
    };

    mockAuthService = {
      user: mockUser
    };

    await TestBed.configureTestingModule({
      imports: [ProjectNewComponent, ReactiveFormsModule, RouterTestingModule.withRoutes([
        { path: 'dashboard', component: DummyComponent }, // Add dummy route for navigation
        { path: 'login', component: DummyComponent } // Add dummy route for potential login navigation
      ]), MockUserProjectComponent, CommonModule], // Import MockUserProjectComponent and CommonModule
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
        // Router is provided by RouterTestingModule, so we inject the real one
      ]
    })
      .overrideComponent(ProjectNewComponent, {
        set: {
          imports: [ReactiveFormsModule, CommonModule, RouterTestingModule, MockUserProjectComponent],
          providers: []
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProjectNewComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); // Inject the real router
    spyOn(router, 'navigate').and.stub(); // Spy on its navigate method
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- ngOnInit Tests ---
  it('should call getAllUsers and populate allUsers on ngOnInit', fakeAsync(() => {
    mockApiService.getAllUsers.and.returnValue(of(mockAllUsers)); // Set mock for this specific test
    component.ngOnInit(); // Re-trigger ngOnInit after changing mock
    tick();

    expect(mockApiService.getAllUsers).toHaveBeenCalled();
    expect(component.allUsers).toEqual(mockAllUsers);
    expect(component.initialParticipantList).toEqual([{ id: NaN, userId: mockUser.id, role: 'ADMIN' }]);
    expect(component.participantsToSave).toEqual([{ id: NaN, userId: mockUser.id, role: 'ADMIN' }]);
  }));

  it('should log error if getAllUsers API fails on ngOnInit', fakeAsync(() => {
    const errorResponse = new Error('Error fetching users');
    mockApiService.getAllUsers.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');

    component.ngOnInit(); // Re-trigger ngOnInit after changing mock
    tick();

    expect(mockApiService.getAllUsers).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching users:', errorResponse);
    expect(component.allUsers).toEqual([]); // Should remain empty as per default mock
  }));

  // --- Form Validation Tests ---
  it('should disable submit button when form is invalid', fakeAsync(() => {
    component.projectForm.controls['nom'].setValue('');
    component.projectForm.controls['description'].setValue('');
    component.participantsToSave = [{ id: NaN, userId: mockUser.id, role: 'ADMIN' }]; // Assume participants are there

    fixture.detectChanges();
    tick(); // process form validation

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBe(true);
  }));

  it('should enable submit button when form is valid and participants exist', fakeAsync(() => {
    component.projectForm.controls['nom'].setValue('New Project');
    component.projectForm.controls['description'].setValue('New Description');
    component.participantsToSave = [{ id: NaN, userId: mockUser.id, role: 'ADMIN' }];

    fixture.detectChanges();
    tick();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBe(false);
  }));


  // --- setParticipants Tests ---
  it('should update participantsToSave via setParticipants method', () => {
    const newParticipants: UserRole[] = [{ id: NaN, userId: 2, role: 'MEMBER' }];
    component.setParticipants(newParticipants);
    expect(component.participantsToSave).toEqual(newParticipants);
  });

  // --- onSubmit() Tests ---
  it('should alert if projectForm is invalid on onSubmit', fakeAsync(() => {
    spyOn(window, 'alert');
    component.projectForm.controls['nom'].setValue(''); // Make form invalid
    component.projectForm.controls['description'].setValue('');
    component.participantsToSave = [{ id: NaN, userId: mockUser.id, role: 'ADMIN' }];

    component.onSubmit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Veuillez remplir les champs du projet.');
    expect(mockApiService.createProject).not.toHaveBeenCalled();
  }));

  it('should alert if participantsToSave is empty on onSubmit (even if form is valid)', fakeAsync(() => {
    spyOn(window, 'alert');
    component.projectForm.controls['nom'].setValue('Valid Project');
    component.projectForm.controls['description'].setValue('Valid Description');
    component.participantsToSave = []; // Make participants empty

    component.onSubmit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Veuillez ajouter au moins un participant.');
    expect(mockApiService.createProject).not.toHaveBeenCalled();
  }));

  it('should log error and alert if createProject API fails', fakeAsync(() => {
    const errorResponse = new Error('Creation failed');
    mockApiService.createProject.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');
    spyOn(window, 'alert');

    component.projectForm.controls['nom'].setValue('New Project');
    component.projectForm.controls['description'].setValue('New Description');
    component.participantsToSave = [{ id: NaN, userId: mockUser.id, role: 'ADMIN' }];

    component.onSubmit();
    tick();

    expect(mockApiService.createProject).toHaveBeenCalled();
    expect(mockApiService.postUsersProject).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error during project creation or user assignment:', errorResponse);
    expect(window.alert).toHaveBeenCalledWith('Une erreur est survenue : ' + errorResponse.message);
  }));

  it('should log error and alert if postUsersProject API fails', fakeAsync(() => {
    const errorResponse = new Error('Assignment failed');
    mockApiService.postUsersProject.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');
    spyOn(window, 'alert');

    component.projectForm.controls['nom'].setValue('New Project');
    component.projectForm.controls['description'].setValue('New Description');
    component.participantsToSave = [{ id: NaN, userId: mockUser.id, role: 'ADMIN' }];

    component.onSubmit();
    tick(); // for createProject
    tick(); // for postUsersProject

    expect(mockApiService.createProject).toHaveBeenCalled();
    expect(mockApiService.postUsersProject).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error during project creation or user assignment:', errorResponse);
    expect(window.alert).toHaveBeenCalledWith('Une erreur est survenue : ' + errorResponse.message);
  }));
});
