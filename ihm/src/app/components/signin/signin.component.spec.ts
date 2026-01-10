import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { SigninComponent } from './signin.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let mockApiService: any;
  let mockAuthService: any;

  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com' };

  beforeEach(async () => {
    mockApiService = {
      postUser: jasmine.createSpy('postUser').and.returnValue(of(mockUser)),
      postLogin: jasmine.createSpy('postLogin').and.returnValue(of({ user: mockUser }))
    };

    mockAuthService = {
      login: jasmine.createSpy('login')
    };

    await TestBed.configureTestingModule({
      imports: [SigninComponent, RouterTestingModule, FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});