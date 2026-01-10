import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserProjectComponent } from './user-project.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

describe('UserProjectComponent', () => {
  let component: UserProjectComponent;
  let fixture: ComponentFixture<UserProjectComponent>;
  let mockApiService: any;
  let mockAuthService: any;

  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com' };

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
      imports: [UserProjectComponent],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
