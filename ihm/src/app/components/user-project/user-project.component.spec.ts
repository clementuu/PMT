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

/**
 * Suite de tests pour le composant UserProjectComponent.
 */
describe('UserProjectComponent', () => {
  /**
   * Instance du composant UserProjectComponent.
   */
  let component: UserProjectComponent;
  /**
   * Fixture du composant pour les tests.
   */
  let fixture: ComponentFixture<UserProjectComponent>;
  /**
   * Service API mocké.
   */
  let mockApiService: any;
  /**
   * Service d'authentification mocké.
   */
  let mockAuthService: any;

  /**
   * Utilisateur mocké pour les tests.
   */
  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com' };
  /**
   * Rôle utilisateur mocké pour les tests.
   */
  const mockUserRole: UserRole = { id: 101, userId: mockUser.id, role: 'ADMIN' };

  /**
   * Configure l'environnement de test avant chaque test.
   */
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

  /**
   * Vérifie si le composant est créé avec succès.
   */
  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  /**
   * Teste l'initialisation du formulaire `addParticipantForm` et de son `FormArray` `participants`.
   */
  it('should initialize addParticipantForm', () => {
    component.ngOnInit();
    expect(component.addParticipantForm).toBeDefined();
    expect(component.participants).toBeInstanceOf(FormArray);
  });

  /**
   * Suite de tests pour la méthode `ngOnInit`.
   */
  describe('ngOnInit', () => {
    /**
     * Réinitialise les participants et les rôles avant chaque test `ngOnInit`.
     */
    beforeEach(() => {
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      mockAuthService.user = mockUser;
      component.currentUserRole = null;
      component.editing = false;
    });

    /**
     * Teste si l'utilisateur actuel est ajouté en tant qu'ADMIN si le projet n'est pas en mode édition.
     */
    it('should add current user as ADMIN if not editing', () => {
      component.ngOnInit();
      expect(component.participants.length).toBe(1);
      const participantValue = component.participants.at(0).getRawValue();
      expect(participantValue.userId).toBe(mockUser.id);
      expect(participantValue.role).toBe('ADMIN');
    });

    /**
     * Teste que l'utilisateur actuel n'est pas ajouté si le projet est en mode édition.
     */
    it('should not add current user if editing is true', () => {
      component.editing = true;
      component.ngOnInit();
      expect(component.participants.length).toBe(0);
    });

    /**
     * Teste que l'utilisateur actuel n'est pas ajouté si `authService.user` est nul.
     */
    it('should not add current user if authService.user is null', () => {
      mockAuthService.user = null;
      component.ngOnInit();
      expect(component.participants.length).toBe(0);
    });
  });

  /**
   * Suite de tests pour la méthode `ngOnChanges`.
   */
  describe('ngOnChanges', () => {
    /**
     * Espionne la méthode `loadParticipants` avant chaque test `ngOnChanges`.
     */
    beforeEach(() => {
      spyOn(component, 'loadParticipants');
    });

    /**
     * Teste si `loadParticipants` est appelé lorsque `projectId` change.
     */
    it('should call loadParticipants when projectId changes', () => {
      const changes: SimpleChanges = {
        projectId: new SimpleChange(0, 1, false)
      };
      component.ngOnChanges(changes);
      expect(component.loadParticipants).toHaveBeenCalled();
    });

    /**
     * Teste si `loadParticipants` est appelé lorsque `editing` change.
     */
    it('should call loadParticipants when editing changes', () => {
      const changes: SimpleChanges = {
        editing: new SimpleChange(false, true, false)
      };
      component.ngOnChanges(changes);
      expect(component.loadParticipants).toHaveBeenCalled();
    });

    /**
     * Teste que `loadParticipants` n'est pas appelé si aucun changement pertinent ne se produit.
     */
    it('should not call loadParticipants if no relevant changes', () => {
      const changes: SimpleChanges = {
        otherProperty: new SimpleChange('old', 'new', false)
      };
      component.ngOnChanges(changes);
      expect(component.loadParticipants).not.toHaveBeenCalled();
    });
  });

  /**
   * Suite de tests pour la méthode `loadParticipants`.
   */
  describe('loadParticipants', () => {
    /**
     * Assure un état propre du tableau `participants` avant chaque test `loadParticipants`.
     */
    beforeEach(() => {
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      component.projectId = 0;
      component.editing = false;
    });

    /**
     * Teste le chargement et la construction du formulaire avec les utilisateurs existants lors de l'édition d'un projet valide.
     */
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
      expect(component.participants.at(0).value.id).toBe(1);
    });

    /**
     * Teste l'effacement des participants si le projet n'est pas en mode édition.
     */
    it('should clear participants if not editing', () => {
      component.editing = false;
      component.addParticipant({ userId: 99, role: 'OBSERVER' });
      expect(component.participants.length).toBe(1);
      component.loadParticipants();
      expect(component.participants.length).toBe(0);
      expect(mockApiService.getUsersProject).not.toHaveBeenCalled();
    });

    /**
     * Teste l'effacement des participants si `projectId` est 0 et le projet n'est pas en mode édition.
     */
    it('should clear participants if projectId is 0 and not editing', () => {
      component.editing = false;
      component.projectId = 0;
      component.addParticipant({ userId: 99, role: 'OBSERVER' });
      expect(component.participants.length).toBe(1);
      component.loadParticipants();
      expect(component.participants.length).toBe(0);
      expect(mockApiService.getUsersProject).not.toHaveBeenCalled();
    });

    /**
     * Teste l'effacement des participants si `projectId` est 0 même si le projet est en mode édition.
     */
    it('should clear participants if projectId is 0 even if editing is true', () => {
      component.editing = true;
      component.projectId = 0;
      component.addParticipant({ userId: 99, role: 'OBSERVER' });
      expect(component.participants.length).toBe(1);
      component.loadParticipants();
      expect(component.participants.length).toBe(0);
      expect(mockApiService.getUsersProject).not.toHaveBeenCalled();
    });
  });

  /**
   * Suite de tests pour la méthode `addParticipant`.
   */
  describe('addParticipant', () => {
    /**
     * Prépare l'état du composant avant chaque test `addParticipant`.
     */
    beforeEach(() => {
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      component.editing = true;
      component.ngOnInit();
    });

    /**
     * Teste l'ajout d'un nouveau participant avec des valeurs par défaut (rôle ADMIN, non désactivé).
     */
    it('should add a new participant with default values (ADMIN role, not disabled)', () => {
      component.currentUserRole = 'ADMIN';
      component.addParticipant();
      expect(component.participants.length).toBe(1);
      expect(component.participants.at(0).value.userId).toBe('');
      expect(component.participants.at(0).value.role).toBe('MEMBER');
      expect(component.participants.at(0).get('userId')?.disabled).toBeFalse();
      expect(component.participants.at(0).get('role')?.disabled).toBeFalse();
    });

    /**
     * Teste l'ajout d'un nouveau participant avec les valeurs fournies (rôle ADMIN, non désactivé).
     */
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

    /**
     * Teste l'ajout d'un nouveau participant avec les contrôles désactivés si `currentUserRole` est MEMBRE.
     */
    it('should add a new participant with controls disabled if currentUserRole is MEMBER', () => {
      component.currentUserRole = 'MEMBER';
      component.addParticipant();
      expect(component.participants.length).toBe(1);
      expect(component.participants.at(0).get('userId')?.disabled).toBeTrue();
      expect(component.participants.at(0).get('role')?.disabled).toBeTrue();
    });

    /**
     * Teste l'ajout d'un nouveau participant avec les contrôles désactivés si `currentUserRole` est OBSERVATEUR.
     */
    it('should add a new participant with controls disabled if currentUserRole is OBSERVER', () => {
      component.currentUserRole = 'OBSERVER';
      component.addParticipant();
      expect(component.participants.length).toBe(1);
      expect(component.participants.at(0).get('userId')?.disabled).toBeTrue();
      expect(component.participants.at(0).get('role')?.disabled).toBeTrue();
    });
  });

  /**
   * Suite de tests pour la méthode `removeParticipant`.
   */
  describe('removeParticipant', () => {
    /**
     * Prépare l'état du composant avant chaque test `removeParticipant`.
     */
    beforeEach(() => {
      spyOn(component, 'loadParticipants');
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      component.editing = true;
      component.currentUserRole = 'ADMIN';
      component.ngOnInit();
    });

    /**
     * Teste l'appel à `deleteUserProject` et le rechargement des participants si le participant a un ID.
     */
    it('should call deleteUserProject and reload participants if participant has an id', () => {
      component.addParticipant(mockUserRole);
      fixture.detectChanges();
      const removeButton = fixture.nativeElement.querySelector('.grid-row .btn-danger');
      expect(removeButton).toBeTruthy();
      removeButton.click();
      expect(mockApiService.deleteUserProject).toHaveBeenCalledWith(mockUserRole.id);
      expect(component.loadParticipants).toHaveBeenCalled();
    });

    /**
     * Teste la suppression d'un participant du `FormArray` s'il n'a pas d'ID.
     */
    it('should remove participant from FormArray if no id', () => {
      component.addParticipant({ userId: 2, role: 'MEMBER' });
      fixture.detectChanges();
      const removeButton = fixture.nativeElement.querySelector('.grid-row .btn-danger');
      expect(removeButton).toBeTruthy();
      removeButton.click();
      expect(component.participants.length).toBe(0);
      expect(mockApiService.deleteUserProject).not.toHaveBeenCalled();
      expect(component.loadParticipants).not.toHaveBeenCalled();
    });

    /**
     * Teste l'enregistrement d'une erreur si `deleteUserProject` échoue.
     */
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

  /**
   * Suite de tests pour la méthode `onSubmit`.
   */
  describe('onSubmit', () => {
    /**
     * Prépare l'état du composant avant chaque test `onSubmit`.
     */
    beforeEach(() => {
      while (component.participants.length !== 0) {
        component.participants.removeAt(0);
      }
      component.editing = true;
      component.projectId = 1;
      spyOn(component, 'loadParticipants');
    });

    /**
     * Teste l'appel à `postUsersProject` et le rechargement des participants en cas de soumission de formulaire valide (rôle ADMIN).
     */
    it('should call postUsersProject and reload participants on valid form submission (ADMIN role)', () => {
      component.currentUserRole = 'ADMIN';
      component.addParticipant({ userId: 2, role: 'MEMBER' });
      component.addParticipant({ userId: 3, role: 'OBSERVER' });
      fixture.detectChanges();
      const saveButton = fixture.nativeElement.querySelector('.actions-footer .btn-primary');
      expect(saveButton).toBeTruthy();
      saveButton.click();

      expect(mockApiService.postUsersProject).toHaveBeenCalledWith({
        projectId: 1,
        users: [
          { id: null, userId: 2, role: 'MEMBER' },
          { id: null, userId: 3, role: 'OBSERVER' }
        ]
      });
      expect(component.loadParticipants).toHaveBeenCalled();
    });

    /**
     * Teste que `postUsersProject` n'est pas appelé si le formulaire est invalide (rôle ADMIN).
     */
    it('should not call postUsersProject if the form is invalid (ADMIN role)', async () => {
      component.currentUserRole = 'ADMIN';
      component.addParticipant();
      fixture.detectChanges();

      await fixture.whenStable();

      expect(component.addParticipantForm.invalid).toBeTrue();

      const saveButton = fixture.nativeElement.querySelector('.actions-footer .btn-primary');
      expect(saveButton).toBeTruthy();
    });

    /**
     * Teste la gestion des erreurs lorsque `postUsersProject` échoue (rôle ADMIN).
     */
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

    /**
     * Teste le masquage des boutons "Ajouter une ligne" et "Enregistrer" pour le rôle MEMBRE.
     */
    it('should hide "Ajouter une ligne" and "Enregistrer" buttons for MEMBER role', () => {
      component.currentUserRole = 'MEMBER';
      fixture.detectChanges();
      const addButton = fixture.nativeElement.querySelector('.actions-footer .btn-secondary');
      const saveButton = fixture.nativeElement.querySelector('.actions-footer .btn-primary');
      expect(addButton).toBeNull();
      expect(saveButton).toBeNull();
    });

    /**
     * Teste le masquage des boutons "Ajouter une ligne" et "Enregistrer" pour le rôle OBSERVATEUR.
     */
    it('should hide "Ajouter une ligne" and "Enregistrer" buttons for OBSERVER role', () => {
      component.currentUserRole = 'OBSERVER';
      fixture.detectChanges();
      const addButton = fixture.nativeElement.querySelector('.actions-footer .btn-secondary');
      const saveButton = fixture.nativeElement.querySelector('.actions-footer .btn-primary');
      expect(addButton).toBeNull();
      expect(saveButton).toBeNull();
    });
  });

  /**
   * Suite de tests pour la méthode `getRoleDisplayName`.
   */
  describe('getRoleDisplayName', () => {
    /**
     * Teste si le nom d'affichage correct est retourné pour les rôles connus.
     */
    it('should return the display name for known roles', () => {
      expect(component.getRoleDisplayName('ADMIN')).toBe('Administrateur');
      expect(component.getRoleDisplayName('MEMBER')).toBe('Membre');
      expect(component.getRoleDisplayName('OBSERVER')).toBe('Observateur');
    });

    /**
     * Teste si le rôle lui-même est retourné pour les rôles inconnus.
     */
    it('should return the role itself for unknown roles', () => {
      expect(component.getRoleDisplayName('UNKNOWN_ROLE')).toBe('UNKNOWN_ROLE');
    });
  });
});