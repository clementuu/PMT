import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ProjectNewComponent } from './project-new.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Project } from '../../models/project.model';
import { Router } from '@angular/router';

describe('ProjectNewComponent', () => {
  let component: ProjectNewComponent;
  let fixture: ComponentFixture<ProjectNewComponent>;
  let mockApiService: any;
  let mockAuthService: any;
  let mockRouter: any;

  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com' };
  const mockProject: Project = { id: 1, nom: 'Test Project', description: 'Test Description' ,tasks: [], dateFin: new Date('2024-12-31') };

  beforeEach(async () => {
    mockApiService = {
      getAllUsers: jasmine.createSpy('getAllUsers').and.returnValue(of([mockUser])),
      createProject: jasmine.createSpy('createProject').and.returnValue(of(mockProject)),
      postUsersProject: jasmine.createSpy('postUsersProject').and.returnValue(of({}))
    };

    mockAuthService = {
      user: mockUser
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [ProjectNewComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
