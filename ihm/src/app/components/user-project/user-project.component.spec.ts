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
    // fixture.detectChanges(); // Removed from here
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
    // Each test in this describe block will ensure a clean state
    beforeEach(() => {
      // Clear participants created by previous tests or default component initialization
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      // Reset authService.user to default mockUser for these tests
      mockAuthService.user = mockUser;
    });

    it('should add current user as ADMIN if not editing', () => {
      component.editing = false;
      component.ngOnInit();
      expect(component.participants.length).toBe(1);
      expect(component.participants.at(0).value.userId).toBe(mockUser.id);
      expect(component.participants.at(0).value.role).toBe('ADMIN');
    });

    it('should not add current user if editing is true', () => {
      component.editing = true;
      component.ngOnInit();
      expect(component.participants.length).toBe(0);
    });

    it('should not add current user if authService.user is null', () => {
      mockAuthService.user = null;
      component.editing = false;
      component.ngOnInit();
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
      const existingUsers = [{ id: 1, userId: 2, role: 'MEMBER' }];
      mockApiService.getUsersProject.and.returnValue(of({ users: existingUsers }));
      component.loadParticipants();
      expect(mockApiService.getUsersProject).toHaveBeenCalledWith(1);
      expect(component.participants.length).toBe(1);
      expect(component.participants.at(0).value.userId).toBe(2);
      expect(component.participants.at(0).value.role).toBe('MEMBER');
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
      // Ensure a clean state for participants array before each addParticipant test
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      component.editing = true; // Set editing to true to prevent ngOnInit from adding user
      component.ngOnInit(); // Manually call ngOnInit
    });

    it('should add a new participant with default values', () => {
      component.addParticipant();
      // If ngOnInit adds a user, we expect 2, otherwise 1
      const expectedLength = component.editing ? 1 : (mockAuthService.user ? 2 : 1);
      expect(component.participants.length).toBe(1); // Should be 1 as ngOnInit should not add if editing is true
      expect(component.participants.at(0).value.userId).toBe('');
      expect(component.participants.at(0).value.role).toBe('MEMBER');
    });

    it('should add a new participant with provided values', () => {
      const newParticipant = { userId: 5, role: 'OBSERVER' };
      component.addParticipant(newParticipant);
      // If ngOnInit adds a user, we expect 2, otherwise 1
      const expectedLength = component.editing ? 1 : (mockAuthService.user ? 2 : 1);
      expect(component.participants.length).toBe(1); // Should be 1 as ngOnInit should not add if editing is true
      expect(component.participants.at(0).value.userId).toBe(5);
      expect(component.participants.at(0).value.role).toBe('OBSERVER');
    });
  });

  describe('removeParticipant', () => {
    beforeEach(() => {
      spyOn(component, 'loadParticipants'); // Spy on loadParticipants as it's called after successful deletion
      // Ensure a clean state for participants array before each removeParticipant test
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      component.editing = true; // Set editing to true to prevent ngOnInit from adding user
      component.ngOnInit(); // Manually call ngOnInit
    });

    it('should call deleteUserProject and reload participants if participant has an id', () => {
      component.addParticipant(mockUserRole); // Add a participant with an ID
      expect(component.participants.length).toBe(1); // Ensure it's added
      component.removeParticipant(0);
      expect(mockApiService.deleteUserProject).toHaveBeenCalledWith(mockUserRole.id);
      expect(component.loadParticipants).toHaveBeenCalled();
    });

    it('should remove participant from FormArray if no id', () => {
      component.addParticipant({ userId: 2, role: 'MEMBER' }); // Add a participant without an ID
      expect(component.participants.length).toBe(1);
      component.removeParticipant(0);
      expect(component.participants.length).toBe(0);
      expect(mockApiService.deleteUserProject).not.toHaveBeenCalled();
      expect(component.loadParticipants).not.toHaveBeenCalled();
    });

    it('should log error if deleteUserProject fails', () => {
      component.addParticipant(mockUserRole);
      mockApiService.deleteUserProject.and.returnValue(throwError(() => new Error('Delete failed')));
      const consoleErrorSpy = spyOn(console, 'error');
      component.removeParticipant(0);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting user from project', jasmine.any(Error));
      expect(component.loadParticipants).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      // Ensure a clean state for participants array before each onSubmit test
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      component.editing = true; // Set editing to true to prevent ngOnInit from adding user
      component.ngOnInit(); // Manually call ngOnInit
      component.projectId = 1; // Default project ID for onSubmit tests
      spyOn(component, 'loadParticipants'); // Spy on loadParticipants
    });

    it('should call postUsersProject and reload participants on valid form submission', () => {
      component.addParticipant({ userId: 2, role: 'MEMBER' });
      component.addParticipant({ userId: 3, role: 'OBSERVER' });

      component.onSubmit();

      expect(mockApiService.postUsersProject).toHaveBeenCalledWith({
        projectId: 1,
        users: [
          { id: null, userId: 2, role: 'MEMBER' },
          { id: null, userId: 3, role: 'OBSERVER' }
        ]
      });
      expect(component.loadParticipants).toHaveBeenCalled();
    });

    it('should not call postUsersProject if the form is invalid', () => {
      component.addParticipant(); // Adds an invalid participant (userId is empty)
      component.onSubmit();
      expect(mockApiService.postUsersProject).not.toHaveBeenCalled();
      expect(component.loadParticipants).not.toHaveBeenCalled();
    });

    it('should handle error when postUsersProject fails', () => {
      component.addParticipant({ userId: 2, role: 'MEMBER' });
      mockApiService.postUsersProject.and.returnValue(throwError(() => new Error('Save failed')));
      const consoleErrorSpy = spyOn(console, 'error');
      spyOn(window, 'alert'); // Spy on alert to prevent it from showing during tests

      component.onSubmit();

      expect(mockApiService.postUsersProject).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving participants:', jasmine.any(Error));
      expect(window.alert).toHaveBeenCalledWith("Erreur lors de l'enregistrement des participants.");
      expect(component.loadParticipants).not.toHaveBeenCalled();
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
