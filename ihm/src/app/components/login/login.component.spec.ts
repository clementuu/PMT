import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockApiService: any;
  let mockAuthService: any;
  let router: Router;

  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com' };

  beforeEach(async () => {
    mockApiService = {
      postLogin: jasmine.createSpy('postLogin').and.returnValue(of({ success: true, user: mockUser }))
    };

    mockAuthService = {
      login: jasmine.createSpy('login')
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, RouterTestingModule.withRoutes([])],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
