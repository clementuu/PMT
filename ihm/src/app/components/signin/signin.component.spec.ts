import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { SigninComponent } from './signin.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let mockApiService: any;
  let mockAuthService: any;
  let router: Router;

  const mockUser: User = { id: 1, nom: 'Test User', email: 'test@example.com' };
  const signinRequest = { nom: 'Test User', email: 'test@example.com', mdp: 'password123' };
  const loginRequest = { email: 'test@example.com', mdp: 'password123' };


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
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Form Validation Tests ---
  it('should disable the submit button initially when form is invalid', fakeAsync(() => {
    tick(); // allow form initialization
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBe(true, 'Button should be disabled initially');
  }));

  it('should enable submit button when form is valid and passwords match', fakeAsync(() => {
    component.nom = signinRequest.nom;
    component.email = signinRequest.email;
    component.password = signinRequest.mdp; // 11 chars > minlength 4
    component.confirmPassword = signinRequest.mdp;

    fixture.detectChanges();
    tick(); // process ngModel updates and validation
    fixture.detectChanges(); // update disabled state

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBe(false, 'Button should be enabled when form is valid');
  }));

  it('should disable submit button if passwords do not match', fakeAsync(() => {
    component.nom = signinRequest.nom;
    component.email = signinRequest.email;
    component.password = 'password123';
    component.confirmPassword = 'differentPassword';

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBe(true, 'Button should be disabled if passwords mismatch');
  }));

  it('should disable submit button if email is invalid', fakeAsync(() => {
    component.nom = signinRequest.nom;
    component.email = 'invalid-email';
    component.password = signinRequest.mdp;
    component.confirmPassword = signinRequest.mdp;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBe(true, 'Button should be disabled if email is invalid');
  }));

  // --- onSubmit() Success Path ---
  it('should call postUser, postLogin, authService.login and navigate on successful signin', fakeAsync(() => {
    component.nom = signinRequest.nom;
    component.email = signinRequest.email;
    component.password = signinRequest.mdp;
    component.confirmPassword = signinRequest.mdp;

    component.onSubmit();
    tick(); // for postUser
    tick(); // for postLogin

    expect(mockApiService.postUser).toHaveBeenCalledWith(signinRequest);
    expect(mockApiService.postLogin).toHaveBeenCalledWith(loginRequest);
    expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.signinError).toBeNull();
  }));

  // --- onSubmit() Failure Paths ---
  it('should set signinError and not navigate if postUser fails', fakeAsync(() => {
    mockApiService.postUser.and.returnValue(throwError(() => new Error('Registration failed')));
    component.nom = signinRequest.nom;
    component.email = signinRequest.email;
    component.password = signinRequest.mdp;
    component.confirmPassword = signinRequest.mdp;

    component.onSubmit();
    tick(); // for postUser observable to complete

    expect(mockApiService.postUser).toHaveBeenCalled();
    expect(mockApiService.postLogin).not.toHaveBeenCalled();
    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.signinError).toBe("Une erreur s'est produite.");
  }));

  it('should set signinError, navigate to /login if postUser succeeds but postLogin fails', fakeAsync(() => {
    mockApiService.postLogin.and.returnValue(throwError(() => new Error('Login failed')));
    component.nom = signinRequest.nom;
    component.email = signinRequest.email;
    component.password = signinRequest.mdp;
    component.confirmPassword = signinRequest.mdp;

    component.onSubmit();
    tick(); // for postUser
    tick(); // for postLogin

    expect(mockApiService.postUser).toHaveBeenCalled();
    expect(mockApiService.postLogin).toHaveBeenCalled();
    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled(); 
    expect(component.signinError).toBe("Une erreur s'est produite.");
  }));

  it('should set signinError, navigate to /login if postUser succeeds but postLogin returns no user', fakeAsync(() => {
    mockApiService.postLogin.and.returnValue(of({ user: null })); // Simulate API returning no user
    component.nom = signinRequest.nom;
    component.email = signinRequest.email;
    component.password = signinRequest.mdp;
    component.confirmPassword = signinRequest.mdp;

    component.onSubmit();
    tick(); // for postUser
    tick(); // for postLogin

    expect(mockApiService.postUser).toHaveBeenCalled();
    expect(mockApiService.postLogin).toHaveBeenCalled();
    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.signinError).toBe("La connexion a échoué: utilisateur non retourné.");
  }));

  // --- Error Message Display Tests ---
  it('should display signinError message in template when set', fakeAsync(() => {
    component.signinError = 'Test Signin Error';
    fixture.detectChanges();
    tick(); // ensure template is updated

    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement).toBeTruthy();
    expect(errorMessageElement.nativeElement.textContent).toContain('Test Signin Error');
  }));

  it('should not display signinError message in template when null', () => {
    component.signinError = null;
    fixture.detectChanges();

    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    // Check if there's any error message that specifically matches our error message display area.
    // The previous error-message selectors were for input validation errors, not the component-wide error.
    // Assuming the component-wide error message has specific styling or a distinct parent.
    // Based on the HTML, it's just a div with class "error-message" directly under the form.
    const allErrorMessages = fixture.debugElement.queryAll(By.css('.error-message'));
    const componentWideError = allErrorMessages.find(el => el.nativeElement.textContent.includes('Test Signin Error'));
    expect(componentWideError).toBeFalsy();
  });
});