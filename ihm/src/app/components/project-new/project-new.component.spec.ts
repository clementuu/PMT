import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
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

/**
 * Composant factice utilisé pour les tests de routage.
 */
@Component({ template: '' })
class DummyComponent { }

/**
 * Composant mock pour le composant UserProject.
 */
@Component({ selector: 'app-user-project', template: '' })
class MockUserProjectComponent {
  @Input() allUsers: User[] = [];
  @Input() availableRoles: string[] = [];
  @Input() editing: boolean = false;
  @Input() initialParticipantList: UserRole[] = [];
}


/**
 * Suite de tests pour le composant ProjectNewComponent.
 */
describe('ProjectNewComponent', () => {
  /**
   * Instance du composant ProjectNewComponent.
   */
  let component: ProjectNewComponent;
  /**
   * Fixture du composant pour les tests.
   */
  let fixture: ComponentFixture<ProjectNewComponent>;
  /**
   * Service API mocké.
   */
  let mockApiService: any;
  /**
   * Service d'authentification mocké.
   */
  let mockAuthService: any;
  /**
   * Instance du routeur.
   */
  let router: Router;

  /**
   * Utilisateur mocké pour les tests.
   */
  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com' };
  /**
   * Projet mocké pour les tests.
   */
  const mockProject: Project = { id: 1, nom: 'Test Project', description: 'Test Description', tasks: [], dateDebut: new Date('2024-01-31'), dateFin: new Date('2024-12-31') };
  /**
   * Liste de tous les utilisateurs mockés.
   */
  const mockAllUsers: User[] = [{ id: 1, nom: 'User1', email: 'user1@test.com' }, { id: 2, nom: 'User2', email: 'user2@test.com' }];


  /**
   * Configure l'environnement de test avant chaque test.
   */
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
        { path: 'dashboard', component: DummyComponent },
        { path: 'login', component: DummyComponent }
      ]), MockUserProjectComponent, CommonModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
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
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
  });

  /**
   * Vérifie si le composant est créé avec succès.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- ngOnInit Tests ---
  /**
   * Teste que `getAllUsers` est appelé et que `allUsers` est rempli lors de l'initialisation du composant.
   */
  it('should call getAllUsers and populate allUsers on ngOnInit', fakeAsync(() => {
    mockApiService.getAllUsers.and.returnValue(of(mockAllUsers));
    component.ngOnInit();
    tick();

    expect(mockApiService.getAllUsers).toHaveBeenCalled();
    expect(component.allUsers).toEqual(mockAllUsers);
    expect(component.initialParticipantList).toEqual([{ id: NaN, userId: mockUser.id, role: 'ADMIN' }]);
    expect(component.participantsToSave).toEqual([{ id: NaN, userId: mockUser.id, role: 'ADMIN' }]);
  }));

  /**
   * Teste si une erreur est loguée si l'appel API `getAllUsers` échoue lors de l'initialisation du composant.
   */
  it('should log error if getAllUsers API fails on ngOnInit', fakeAsync(() => {
    const errorResponse = new Error('Error fetching users');
    mockApiService.getAllUsers.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');

    component.ngOnInit();
    tick();

    expect(mockApiService.getAllUsers).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching users:', errorResponse);
    expect(component.allUsers).toEqual([]);
  }));

  /**
   * Teste si le bouton de soumission est désactivé lorsque le formulaire est invalide.
   */
  it('should disable submit button when form is invalid', fakeAsync(() => {
    component.projectForm.controls['nom'].setValue('');
    component.projectForm.controls['description'].setValue('');
    component.participantsToSave = [{ id: NaN, userId: mockUser.id, role: 'ADMIN' }];

    fixture.detectChanges();
    tick();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBe(true);
  }));

  /**
   * Teste si le bouton de soumission est activé lorsque le formulaire est valide et que des participants existent.
   */
  it('should enable submit button when form is valid and participants exist', fakeAsync(() => {
    component.projectForm.controls['nom'].setValue('New Project');
    component.projectForm.controls['description'].setValue('New Description');
    component.projectForm.controls['dateDebut'].setValue('2024-01-01');
    component.participantsToSave = [{ id: NaN, userId: mockUser.id, role: 'ADMIN' }];

    fixture.detectChanges();
    tick();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBe(false);
  }));

  /**
   * Teste la mise à jour de `participantsToSave` via la méthode `setParticipants`.
   */
  it('should update participantsToSave via setParticipants method', () => {
    const newParticipants: UserRole[] = [{ id: NaN, userId: 2, role: 'MEMBER' }];
    component.setParticipants(newParticipants);
    expect(component.participantsToSave).toEqual(newParticipants);
  });

  /**
   * Teste si une alerte est affichée si `projectForm` est invalide lors de la soumission.
   */
  it('should alert if projectForm is invalid on onSubmit', fakeAsync(() => {
    spyOn(window, 'alert');
    component.projectForm.controls['nom'].setValue('');
    component.projectForm.controls['description'].setValue('');
    component.participantsToSave = [{ id: NaN, userId: mockUser.id, role: 'ADMIN' }];

    component.onSubmit();
    tick();

    expect(window.alert).toHaveBeenCalledWith('Veuillez remplir les champs du projet.');
    expect(mockApiService.createProject).not.toHaveBeenCalled();
  }));

  /**
   * Teste si une alerte est affichée si `participantsToSave` est vide lors de la soumission.
   */
  it('should alert if participantsToSave is empty on onSubmit (even if form is valid)', fakeAsync(() => {
    spyOn(window, 'alert');
    component.projectForm.controls['nom'].setValue('Valid Project');
    component.projectForm.controls['description'].setValue('Valid Description');
    component.projectForm.controls['dateDebut'].setValue('2024-01-01');
    component.participantsToSave = [];

    component.onSubmit();
    tick();

    expect(window.alert).toHaveBeenCalledWith("Veuillez ajouter au moins un participant.");
    expect(mockApiService.createProject).not.toHaveBeenCalled();
  }));

  /**
   * Teste si une erreur est loguée et une alerte affichée si l'appel API `createProject` échoue.
   */
  it('should log error and alert if createProject API fails', fakeAsync(() => {
    const errorResponse = new Error('Creation failed');
    mockApiService.createProject.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');
    spyOn(window, 'alert');

    component.projectForm.controls['nom'].setValue('New Project');
    component.projectForm.controls['description'].setValue('New Description');
    component.projectForm.controls['dateDebut'].setValue('2024-01-01');
    component.participantsToSave = [{ id: NaN, userId: mockUser.id, role: 'ADMIN' }];

    component.onSubmit();
    tick();

    expect(mockApiService.createProject).toHaveBeenCalled();
    expect(mockApiService.postUsersProject).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error during project creation or user assignment:', errorResponse);
    expect(window.alert).toHaveBeenCalledWith('Une erreur est survenue : ' + errorResponse.message);
  }));

  /**
   * Teste si une erreur est loguée et une alerte affichée si l'appel API `postUsersProject` échoue.
   */
  it('should log error and alert if postUsersProject API fails', fakeAsync(() => {
    const errorResponse = new Error('Assignment failed');
    mockApiService.postUsersProject.and.returnValue(throwError(() => errorResponse));
    spyOn(console, 'error');
    spyOn(window, 'alert');

    component.projectForm.controls['nom'].setValue('New Project');
    component.projectForm.controls['description'].setValue('New Description');
    component.projectForm.controls['dateDebut'].setValue('2024-01-01'); // Added missing required field
    component.participantsToSave = [{ id: NaN, userId: mockUser.id, role: 'ADMIN' }];

    mockApiService.createProject.and.returnValue(of(mockProject));

    component.onSubmit();
    tick();
    tick();

    expect(mockApiService.createProject).toHaveBeenCalled();
    expect(mockApiService.postUsersProject).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error during project creation or user assignment:', errorResponse);
    expect(window.alert).toHaveBeenCalledWith('Une erreur est survenue : ' + errorResponse.message);
  }));
});