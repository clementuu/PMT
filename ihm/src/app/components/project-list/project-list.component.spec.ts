import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs'; // Import throwError
import { ProjectListComponent } from './project-list.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let mockApiService: any;
  let mockAuthService: any;
  let mockRouter: any;

  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com'};
  const mockProjects: Project[] = [
    { id: 1, nom: 'Project Alpha', description: 'Desc Alpha', dateFin: new Date(), tasks: [] },
    { id: 2, nom: 'Project Beta', description: 'Desc Beta', dateFin: new Date(), tasks: [] },
  ];

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

  it('should create', () => {
    fixture.detectChanges(); // Trigger ngOnInit
    expect(component).toBeTruthy();
  });

  it('should load projects on ngOnInit if user is logged in', () => {
    fixture.detectChanges(); // Trigger ngOnInit
    expect(mockAuthService.user).toEqual(mockUser);
    expect(mockApiService.getProjectsByUserId).toHaveBeenCalledWith(mockUser.id);
    component.projects$.subscribe(projects => {
      expect(projects).toEqual(mockProjects);
    });
  });

  it('should not load projects on ngOnInit if user is not logged in', () => {
    mockAuthService.user = null; // Simulate no logged-in user
    fixture.detectChanges(); // Trigger ngOnInit after setting user to null
    expect(mockApiService.getProjectsByUserId).not.toHaveBeenCalled();
  });

  it('should navigate to project details when goToProject is called', () => {
    fixture.detectChanges(); // Trigger ngOnInit
    const projectId = 1;
    component.goToProject(projectId);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/project', projectId]);
  });

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
