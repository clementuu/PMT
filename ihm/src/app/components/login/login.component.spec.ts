import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { LoginComponent } from './login.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

/**
 * Suite de tests pour le composant LoginComponent.
 */
describe('LoginComponent', () => {
  /**
   * Instance du composant LoginComponent.
   */
  let component: LoginComponent;
  /**
   * Fixture du composant pour les tests.
   */
  let fixture: ComponentFixture<LoginComponent>;
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
   * Configure l'environnement de test avant chaque test.
   */
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

  /**
   * Vérifie si le composant est créé avec succès.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Teste si le bouton de soumission est désactivé lorsque le formulaire est invalide.
   */
  it('should disable the submit button when the form is invalid', fakeAsync(() => {
    tick();
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    
    expect(submitButton.disabled).toBe(true, 'Expected button to be disabled initially');

    component.email = 'test@example.com';
    component.password = 'password';
    
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(submitButton.disabled).toBe(false, 'Expected button to be enabled after filling form');

    component.email = 'not-an-email';

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(submitButton.disabled).toBe(true, 'Expected button to be disabled with invalid email');
  }));

  /**
   * Teste si `postLogin` est appelé et la navigation se produit en cas de soumission réussie.
   */
  it('should call postLogin and navigate on successful submission', fakeAsync(() => {
    component.email = 'test@example.com';
    component.password = 'password';
    
    component.onSubmit();
    tick();

    expect(mockApiService.postLogin).toHaveBeenCalledWith({ email: 'test@example.com', mdp: 'password' });
    expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.loginError).toBeNull();
  }));

  /**
   * Teste si `loginError` est défini en cas d'échec de connexion (informations d'identification invalides).
   */
  it('should set loginError on failed login (invalid credentials)', fakeAsync(() => {
    mockApiService.postLogin.and.returnValue(of({ success: false }));
    component.email = 'test@example.com';
    component.password = 'wrongpassword';

    component.onSubmit();
    tick();

    expect(mockApiService.postLogin).toHaveBeenCalled();
    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.loginError).toBe('Email ou mot de passe incorrect.');
  }));

  /**
   * Teste si `loginError` est défini en cas d'erreur API.
   */
  it('should set loginError on API error', fakeAsync(() => {
    mockApiService.postLogin.and.returnValue(throwError(() => new Error('API Down')));
    component.email = 'test@example.com';
    component.password = 'password';

    component.onSubmit();
    tick();

    expect(mockApiService.postLogin).toHaveBeenCalled();
    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.loginError).toBe("Une erreur s'est produite lors de la connexion.");
  }));

  /**
   * Teste si le message d'erreur est affiché dans le template lorsque `loginError` est défini.
   */
  it('should display the error message in the template when loginError is set', async () => {
    component.loginError = 'This is a test error.';
    fixture.detectChanges();
    await fixture.whenStable();

    const errorElement = fixture.debugElement.query(By.css('.component-error'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent.trim()).toBe('This is a test error.');
  });

  /**
   * Teste si aucun message d'erreur n'est affiché lorsque `loginError` est nul.
   */
  it('should not display an error message when loginError is null', () => {
    component.loginError = null;
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.component-error'));
    expect(errorElement).toBeFalsy();
  });
});