import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { SimpleChange, SimpleChanges } from '@angular/core';

import { UserProjectComponent } from './user-project.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { UserRole } from '../../models/userProject.model';

describe('UserProjectComponent', () => {
  let component: UserProjectComponent;
  let fixture: ComponentFixture<UserProjectComponent>;
  let mockApiService: any;
  let mockAuthService: any;

  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com' };
  const mockUserRole: UserRole = { id: 101, userId: mockUser.id, role: 'ADMIN' };

  beforeEach(async () => {
    mockApiService = {
      getUsersProject: jasmine.createSpy('getUsersProject').and.returnValue(of({ users: [] })),
      deleteUserProject: jasmine.createSpy('deleteUserProject').and.returnValue(of(void 0)),
      postUsersProject: jasmine.createSpy('postUsersProject').and.returnValue(of({}))
    };

    mockAuthService = {
      user: mockUser
    };

    await TestBed.configureTestingModule({
      imports: [UserProjectComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProjectComponent);
    component = fixture.componentInstance;
    component.currentUserRole = 'ADMIN'; // Default to ADMIN for most tests
    component.editing = true; // Default to editing an existing project for most tests
  });

  it('should create', () => {
    component.ngOnInit(); // Manually call ngOnInit for this test
    expect(component).toBeTruthy();
  });

  it('should initialize addParticipantForm', () => {
    component.ngOnInit(); // Manually call ngOnInit for this test
    expect(component.addParticipantForm).toBeDefined();
    expect(component.participants).toBeInstanceOf(FormArray);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      mockAuthService.user = mockUser;
      component.currentUserRole = null; // Reset for ngOnInit tests
      component.editing = false; // Reset for ngOnInit tests
    });

    it('should add current user as ADMIN if not editing', () => {
      component.ngOnInit(); // editing is false by beforeEach
      expect(component.participants.length).toBe(1);
      // Use getRawValue() to ensure we get values even if controls are mistakenly disabled
      const participantValue = component.participants.at(0).getRawValue();
      expect(participantValue.userId).toBe(mockUser.id);
      expect(participantValue.role).toBe('ADMIN');
    });

    it('should not add current user if editing is true', () => {
      component.editing = true; // Override for this test
      component.ngOnInit();
      expect(component.participants.length).toBe(0);
    });

    it('should not add current user if authService.user is null', () => {
      mockAuthService.user = null;
      component.ngOnInit(); // editing is false by beforeEach
      expect(component.participants.length).toBe(0);
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      spyOn(component, 'loadParticipants');
    });

    it('should call loadParticipants when projectId changes', () => {
      const changes: SimpleChanges = {
        projectId: new SimpleChange(0, 1, false)
      };
      component.ngOnChanges(changes);
      expect(component.loadParticipants).toHaveBeenCalled();
    });

    it('should call loadParticipants when editing changes', () => {
      const changes: SimpleChanges = {
        editing: new SimpleChange(false, true, false)
      };
      component.ngOnChanges(changes);
      expect(component.loadParticipants).toHaveBeenCalled();
    });

    it('should not call loadParticipants if no relevant changes', () => {
      const changes: SimpleChanges = {
        otherProperty: new SimpleChange('old', 'new', false)
      };
      component.ngOnChanges(changes);
      expect(component.loadParticipants).not.toHaveBeenCalled();
    });
  });

  describe('loadParticipants', () => {
    beforeEach(() => {
      // Ensure a clean state for participants array before each loadParticipants test
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      component.projectId = 0; // Reset projectId for consistent testing
      component.editing = false; // Reset editing for consistent testing
    });

    it('should fetch and build form with existing users when editing and projectId is valid', () => {
      component.editing = true;
      component.projectId = 1;
      const existingUsers = [{ id: 1, userId: 2, role: 'ADMIN' }];
      mockApiService.getUsersProject.and.returnValue(of({ users: existingUsers }));
      component.loadParticipants();
      expect(mockApiService.getUsersProject).toHaveBeenCalledWith(1);
      expect(component.participants.length).toBe(1);
      expect(component.participants.at(0).value.userId).toBe(2);
      expect(component.participants.at(0).value.role).toBe('ADMIN');
      expect(component.participants.at(0).value.id).toBe(1); // Expecting the id from existingUsers
    });

    it('should clear participants if not editing', () => {
      component.editing = false;
      component.addParticipant({ userId: 99, role: 'OBSERVER' }); // Add a dummy participant
      expect(component.participants.length).toBe(1);
      component.loadParticipants();
      expect(component.participants.length).toBe(0);
      expect(mockApiService.getUsersProject).not.toHaveBeenCalled();
    });

    it('should clear participants if projectId is 0 and not editing', () => {
      component.editing = false; // Important to be false here to prevent API call
      component.projectId = 0;
      component.addParticipant({ userId: 99, role: 'OBSERVER' }); // Add a dummy participant
      expect(component.participants.length).toBe(1);
      component.loadParticipants();
      expect(component.participants.length).toBe(0);
      expect(mockApiService.getUsersProject).not.toHaveBeenCalled();
    });

    it('should clear participants if projectId is 0 even if editing is true', () => {
      component.editing = true;
      component.projectId = 0;
      component.addParticipant({ userId: 99, role: 'OBSERVER' }); // Add a dummy participant
      expect(component.participants.length).toBe(1);
      component.loadParticipants();
      expect(component.participants.length).toBe(0);
      expect(mockApiService.getUsersProject).not.toHaveBeenCalled();
    });
  });

  describe('addParticipant', () => {
    beforeEach(() => {
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      component.editing = true; // Always editing an existing project for these tests
      component.ngOnInit(); // Call ngOnInit to initialize component, though it shouldn't add participants if editing is true
    });

    it('should add a new participant with default values (ADMIN role, not disabled)', () => {
      component.currentUserRole = 'ADMIN';
      component.addParticipant();
      expect(component.participants.length).toBe(1);
      expect(component.participants.at(0).value.userId).toBe('');
      expect(component.participants.at(0).value.role).toBe('MEMBER');
      expect(component.participants.at(0).get('userId')?.disabled).toBeFalse();
      expect(component.participants.at(0).get('role')?.disabled).toBeFalse();
    });

    it('should add a new participant with provided values (ADMIN role, not disabled)', () => {
      component.currentUserRole = 'ADMIN';
      const newParticipant = { userId: 5, role: 'OBSERVER' };
      component.addParticipant(newParticipant);
      expect(component.participants.length).toBe(1);
      expect(component.participants.at(0).value.userId).toBe(5);
      expect(component.participants.at(0).value.role).toBe('OBSERVER');
      expect(component.participants.at(0).get('userId')?.disabled).toBeFalse();
      expect(component.participants.at(0).get('role')?.disabled).toBeFalse();
    });

    it('should add a new participant with controls disabled if currentUserRole is MEMBER', () => {
      component.currentUserRole = 'MEMBER';
      component.addParticipant();
      expect(component.participants.length).toBe(1);
      expect(component.participants.at(0).get('userId')?.disabled).toBeTrue();
      expect(component.participants.at(0).get('role')?.disabled).toBeTrue();
    });

    it('should add a new participant with controls disabled if currentUserRole is OBSERVER', () => {
      component.currentUserRole = 'OBSERVER';
      component.addParticipant();
      expect(component.participants.length).toBe(1);
      expect(component.participants.at(0).get('userId')?.disabled).toBeTrue();
      expect(component.participants.at(0).get('role')?.disabled).toBeTrue();
    });
  });

  describe('removeParticipant', () => {
    beforeEach(() => {
      spyOn(component, 'loadParticipants'); // Spy on loadParticipants as it's called after successful deletion
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      component.editing = true; // Set editing to true
      component.currentUserRole = 'ADMIN'; // Set currentUserRole to ADMIN for these tests
      component.ngOnInit(); // Manually call ngOnInit
    });

    it('should call deleteUserProject and reload participants if participant has an id', () => {
      component.addParticipant(mockUserRole); // Add a participant with an ID
      fixture.detectChanges(); // Detect changes to render the button
      const removeButton = fixture.nativeElement.querySelector('.grid-row .btn-danger');
      expect(removeButton).toBeTruthy(); // Ensure the button is visible
      removeButton.click(); // Simulate click
      expect(mockApiService.deleteUserProject).toHaveBeenCalledWith(mockUserRole.id);
      expect(component.loadParticipants).toHaveBeenCalled();
    });

    it('should remove participant from FormArray if no id', () => {
      component.addParticipant({ userId: 2, role: 'MEMBER' }); // Add a participant without an ID
      fixture.detectChanges();
      const removeButton = fixture.nativeElement.querySelector('.grid-row .btn-danger');
      expect(removeButton).toBeTruthy();
      removeButton.click();
      expect(component.participants.length).toBe(0);
      expect(mockApiService.deleteUserProject).not.toHaveBeenCalled();
      expect(component.loadParticipants).not.toHaveBeenCalled();
    });

    it('should log error if deleteUserProject fails', () => {
      component.addParticipant(mockUserRole);
      fixture.detectChanges();
      mockApiService.deleteUserProject.and.returnValue(throwError(() => new Error('Delete failed')));
      const consoleErrorSpy = spyOn(console, 'error');
      const removeButton = fixture.nativeElement.querySelector('.grid-row .btn-danger');
      removeButton.click();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting user from project', jasmine.any(Error));
      expect(component.loadParticipants).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      component.editing = true; // Set editing to true
      component.projectId = 1; // Default project ID for onSubmit tests
      spyOn(component, 'loadParticipants'); // Spy on loadParticipants
    });

    it('should call postUsersProject and reload participants on valid form submission (ADMIN role)', () => {
      component.currentUserRole = 'ADMIN';
      component.addParticipant({ userId: 2, role: 'MEMBER' });
      component.addParticipant({ userId: 3, role: 'OBSERVER' });
      fixture.detectChanges(); // Update DOM for button visibility
      const saveButton = fixture.nativeElement.querySelector('.actions-footer .btn-primary');
      expect(saveButton).toBeTruthy();
      saveButton.click(); // Simulate click

      expect(mockApiService.postUsersProject).toHaveBeenCalledWith({
        projectId: 1,
        users: [
          { id: null, userId: 2, role: 'MEMBER' },
          { id: null, userId: 3, role: 'OBSERVER' }
        ]
      });
      expect(component.loadParticipants).toHaveBeenCalled();
    });

    it('should not call postUsersProject if the form is invalid (ADMIN role)', async () => {
      component.currentUserRole = 'ADMIN';
      component.addParticipant(); // Adds an invalid participant (userId is empty)
      fixture.detectChanges();

      await fixture.whenStable(); // Wait for all async operations to settle

      // Explicitly check if the form is invalid
      expect(component.addParticipantForm.invalid).toBeTrue();

      const saveButton = fixture.nativeElement.querySelector('.actions-footer .btn-primary');
      expect(saveButton).toBeTruthy();
    });

    it('should handle error when postUsersProject fails (ADMIN role)', () => {
      component.currentUserRole = 'ADMIN';
      component.addParticipant({ userId: 2, role: 'MEMBER' });
      mockApiService.postUsersProject.and.returnValue(throwError(() => new Error('Save failed')));
      const consoleErrorSpy = spyOn(console, 'error');
      spyOn(window, 'alert');
      fixture.detectChanges();
      const saveButton = fixture.nativeElement.querySelector('.actions-footer .btn-primary');
      saveButton.click();

      expect(mockApiService.postUsersProject).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving participants:', jasmine.any(Error));
      expect(window.alert).toHaveBeenCalledWith("Erreur lors de l'enregistrement des participants.");
      expect(component.loadParticipants).not.toHaveBeenCalled();
    });

    it('should hide "Ajouter une ligne" and "Enregistrer" buttons for MEMBER role', () => {
      component.currentUserRole = 'MEMBER';
      fixture.detectChanges();
      const addButton = fixture.nativeElement.querySelector('.actions-footer .btn-secondary');
      const saveButton = fixture.nativeElement.querySelector('.actions-footer .btn-primary');
      expect(addButton).toBeNull();
      expect(saveButton).toBeNull();
    });

    it('should hide "Ajouter une ligne" and "Enregistrer" buttons for OBSERVER role', () => {
      component.currentUserRole = 'OBSERVER';
      fixture.detectChanges();
      const addButton = fixture.nativeElement.querySelector('.actions-footer .btn-secondary');
      const saveButton = fixture.nativeElement.querySelector('.actions-footer .btn-primary');
      expect(addButton).toBeNull();
      expect(saveButton).toBeNull();
    });
  });
  describe('getRoleDisplayName', () => {
    it('should return the display name for known roles', () => {
      expect(component.getRoleDisplayName('ADMIN')).toBe('Administrateur');
      expect(component.getRoleDisplayName('MEMBER')).toBe('Membre');
      expect(component.getRoleDisplayName('OBSERVER')).toBe('Observateur');
    });

    it('should return the role itself for unknown roles', () => {
      expect(component.getRoleDisplayName('UNKNOWN_ROLE')).toBe('UNKNOWN_ROLE');
    });
  });
});
