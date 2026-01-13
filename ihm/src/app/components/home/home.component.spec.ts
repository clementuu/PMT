import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Suite de tests pour le composant HomeComponent.
 */
describe('HomeComponent', () => {
  /**
   * Instance du composant HomeComponent.
   */
  let component: HomeComponent;
  /**
   * Fixture du composant pour les tests.
   */
  let fixture: ComponentFixture<HomeComponent>;
  /**
   * Service d'authentification mocké.
   */
  let mockAuthService: Partial<AuthService>;
  /**
   * Instance du routeur.
   */
  let router: Router;

  /**
   * Configure l'environnement de test avant chaque test.
   */
  beforeEach(async () => {
    mockAuthService = {
      get isLoggedIn() {
        return false;
      }
    };

    await TestBed.configureTestingModule({
      imports: [ HomeComponent, RouterTestingModule.withRoutes([]) ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  /**
   * Vérifie si le composant est créé avec succès.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Teste si le composant redirige vers le tableau de bord si l'utilisateur est connecté.
   */
  it('should redirect to dashboard if user is logged in', () => {
    Object.defineProperty(mockAuthService, 'isLoggedIn', { get: () => true });
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  /**
   * Teste si le composant ne redirige pas si l'utilisateur n'est pas connecté.
   */
  it('should not redirect if user is not logged in', () => {
    Object.defineProperty(mockAuthService, 'isLoggedIn', { get: () => false });
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  /**
   * Teste si les boutons de connexion et d'inscription sont affichés lorsque l'utilisateur n'est pas connecté.
   */
  it('should show login and signin buttons when not logged in', () => {
    Object.defineProperty(mockAuthService, 'isLoggedIn', { get: () => false });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[routerLink="/login"]')).toBeTruthy();
    expect(compiled.querySelector('a[routerLink="/signin"]')).toBeTruthy();
  });

  /**
   * Teste si les boutons de connexion et d'inscription ne sont pas affichés lorsque l'utilisateur est connecté.
   */
  it('should not show login and signin buttons when logged in', () => {
    Object.defineProperty(mockAuthService, 'isLoggedIn', { get: () => true });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[routerLink="/login"]')).toBeFalsy();
    expect(compiled.querySelector('a[routerLink="/signin"]')).toBeFalsy();
  });
});