import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs'; // Import throwError
import { ProjectListComponent } from './project-list.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';

/**
 * Suite de tests pour le composant ProjectListComponent.
 */
describe('ProjectListComponent', () => {
  /**
   * Instance du composant ProjectListComponent.
   */
  let component: ProjectListComponent;
  /**
   * Fixture du composant pour les tests.
   */
  let fixture: ComponentFixture<ProjectListComponent>;
  /**
   * Service API mocké.
   */
  let mockApiService: any;
  /**
   * Service d'authentification mocké.
   */
  let mockAuthService: any;
  /**
   * Routeur mocké.
   */
  let mockRouter: any;

  /**
   * Utilisateur mocké pour les tests.
   */
  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com'};
  /**
   * Liste de projets mockés pour les tests.
   */
  const mockProjects: Project[] = [
    { id: 1, nom: 'Project Alpha', description: 'Desc Alpha', dateDebut: new Date('2024-01-31'), dateFin: new Date(), tasks: [] },
    { id: 2, nom: 'Project Beta', description: 'Desc Beta', dateDebut: new Date('2024-01-31'), dateFin: new Date(), tasks: [] },
  ];

  /**
   * Configure l'environnement de test avant chaque test.
   */
  beforeEach(async () => {
    mockApiService = {
      getProjectsByUserId: jasmine.createSpy('getProjectsByUserId').and.returnValue(of(mockProjects))
    };
    mockAuthService = {
      user: mockUser
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges(); // Remove initial detectChanges to control ngOnInit call
  });

  /**
   * Vérifie si le composant est créé avec succès.
   */
  it('should create', () => {
    fixture.detectChanges(); // Trigger ngOnInit
    expect(component).toBeTruthy();
  });

  /**
   * Teste si les projets sont chargés lors de l'initialisation du composant si l'utilisateur est connecté.
   */
  it('should load projects on ngOnInit if user is logged in', () => {
    fixture.detectChanges(); // Trigger ngOnInit
    expect(mockAuthService.user).toEqual(mockUser);
    expect(mockApiService.getProjectsByUserId).toHaveBeenCalledWith(mockUser.id);
    component.projects$.subscribe(projects => {
      expect(projects).toEqual(mockProjects);
    });
  });

  /**
   * Teste si les projets ne sont pas chargés lors de l'initialisation du composant si l'utilisateur n'est pas connecté.
   */
  it('should not load projects on ngOnInit if user is not logged in', () => {
    mockAuthService.user = null; // Simulate no logged-in user
    fixture.detectChanges(); // Trigger ngOnInit after setting user to null
    expect(mockApiService.getProjectsByUserId).not.toHaveBeenCalled();
  });

  /**
   * Teste la navigation vers les détails du projet lorsque `goToProject` est appelé.
   */
  it('should navigate to project details when goToProject is called', () => {
    fixture.detectChanges(); // Trigger ngOnInit
    const projectId = 1;
    component.goToProject(projectId);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/project', projectId]);
  });

  /**
   * Teste la gestion des erreurs lors du chargement des projets.
   */
  it('should handle error when loading projects', () => {
    const errorResponse = { status: 500, message: 'Server Error' };
    mockApiService.getProjectsByUserId.and.returnValue(throwError(() => errorResponse));
    
    fixture.detectChanges(); // Trigger ngOnInit to call the API service
    
    // Using a spy to confirm error handling, or expecting the observable to complete with an error.
    let caughtError: any;
    component.projects$.subscribe({
      error: err => caughtError = err
    });
    expect(caughtError).toEqual(errorResponse);
  });
});