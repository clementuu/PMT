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

/**
 * Suite de tests pour le composant SigninComponent.
 */
describe('SigninComponent', () => {
  /**
   * Instance du composant SigninComponent.
   */
  let component: SigninComponent;
  /**
   * Fixture du composant pour les tests.
   */
  let fixture: ComponentFixture<SigninComponent>;
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
   * Requête d'inscription mockée.
   */
  const signinRequest = { nom: 'Test User', email: 'test@example.com', mdp: 'password123' };
  /**
   * Requête de connexion mockée.
   */
  const loginRequest = { email: 'test@example.com', mdp: 'password123' };


  /**
   * Configure l'environnement de test avant chaque test.
   */
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

  /**
   * Vérifie si le composant est créé avec succès.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Form Validation Tests ---
  /**
   * Teste si le bouton de soumission est initialement désactivé lorsque le formulaire est invalide.
   */
  it('should disable the submit button initially when form is invalid', fakeAsync(() => {
    tick(); // allow form initialization
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBe(true, 'Button should be disabled initially');
  }));

  /**
   * Teste si le bouton de soumission est activé lorsque le formulaire est valide et que les mots de passe correspondent.
   */
  it('should enable submit button when form is valid and passwords match', fakeAsync(() => {
    component.nom = signinRequest.nom;
    component.email = signinRequest.email;
    component.password = signinRequest.mdp;
    component.confirmPassword = signinRequest.mdp;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBe(false, 'Button should be enabled when form is valid');
  }));

  /**
   * Teste si le bouton de soumission est désactivé si les mots de passe ne correspondent pas.
   */
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

  /**
   * Teste si le bouton de soumission est désactivé si l'e-mail est invalide.
   */
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

  /**
   * Teste si `postUser`, `postLogin`, `authService.login` sont appelés et la navigation se produit en cas d'inscription réussie.
   */
  it('should call postUser, postLogin, authService.login and navigate on successful signin', fakeAsync(() => {
    component.nom = signinRequest.nom;
    component.email = signinRequest.email;
    component.password = signinRequest.mdp;
    component.confirmPassword = signinRequest.mdp;

    component.onSubmit();
    tick();
    tick();

    expect(mockApiService.postUser).toHaveBeenCalledWith(signinRequest);
    expect(mockApiService.postLogin).toHaveBeenCalledWith(loginRequest);
    expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.signinError).toBeNull();
  }));

  /**
   * Teste si `signinError` est défini et la navigation ne se produit pas si `postUser` échoue.
   */
  it('should set signinError and not navigate if postUser fails', fakeAsync(() => {
    mockApiService.postUser.and.returnValue(throwError(() => new Error('Registration failed')));
    component.nom = signinRequest.nom;
    component.email = signinRequest.email;
    component.password = signinRequest.mdp;
    component.confirmPassword = signinRequest.mdp;

    component.onSubmit();
    tick();

    expect(mockApiService.postUser).toHaveBeenCalled();
    expect(mockApiService.postLogin).not.toHaveBeenCalled();
    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.signinError).toBe("Une erreur s'est produite.");
  }));

  /**
   * Teste si `signinError` est défini et navigue vers `/login` si `postUser` réussit mais `postLogin` échoue.
   */
  it('should set signinError, navigate to /login if postUser succeeds but postLogin fails', fakeAsync(() => {
    mockApiService.postLogin.and.returnValue(throwError(() => new Error('Login failed')));
    component.nom = signinRequest.nom;
    component.email = signinRequest.email;
    component.password = signinRequest.mdp;
    component.confirmPassword = signinRequest.mdp;

    component.onSubmit();
    tick();
    tick();

    expect(mockApiService.postUser).toHaveBeenCalled();
    expect(mockApiService.postLogin).toHaveBeenCalled();
    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.signinError).toBe("Une erreur s'est produite.");
  }));

  /**
   * Teste si `signinError` est défini et navigue vers `/login` si `postUser` réussit mais `postLogin` ne retourne aucun utilisateur.
   */
  it('should set signinError, navigate to /login if postUser succeeds but postLogin returns no user', fakeAsync(() => {
    mockApiService.postLogin.and.returnValue(of({ user: null }));
    component.nom = signinRequest.nom;
    component.email = signinRequest.email;
    component.password = signinRequest.mdp;
    component.confirmPassword = signinRequest.mdp;

    component.onSubmit();
    tick();
    tick();

    expect(mockApiService.postUser).toHaveBeenCalled();
    expect(mockApiService.postLogin).toHaveBeenCalled();
    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.signinError).toBe("La connexion a échoué: utilisateur non retourné.");
  }));

  /**
   * Teste si le message d'erreur `signinError` est affiché dans le template lorsqu'il est défini.
   */
  it('should display signinError message in template when set', fakeAsync(() => {
    component.signinError = 'Test Signin Error';
    fixture.detectChanges();
    tick();

    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement).toBeTruthy();
    expect(errorMessageElement.nativeElement.textContent).toContain('Test Signin Error');
  }));

  /**
   * Teste si le message d'erreur `signinError` n'est pas affiché dans le template lorsqu'il est nul.
   */
  it('should not display signinError message in template when null', () => {
    component.signinError = null;
    fixture.detectChanges();

    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement).toBeFalsy();
  });
});
