import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { By } from '@angular/platform-browser'; // Import By

/**
 * Suite de tests pour le composant HeaderComponent.
 */
describe('HeaderComponent', () => {
  /**
   * Instance du composant HeaderComponent.
   */
  let component: HeaderComponent;
  /**
   * Fixture du composant pour les tests.
   */
  let fixture: ComponentFixture<HeaderComponent>;
  /**
   * Service d'authentification mocké.
   */
  let authService: AuthService;

  /**
   * Configure l'environnement de test avant chaque test.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HeaderComponent, RouterTestingModule ],
      providers: [ AuthService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  /**
   * Vérifie si le composant est créé avec succès.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Teste que le message de bienvenue et le bouton de déconnexion ne sont pas affichés
   * lorsque l'utilisateur n'est pas connecté.
   */
  it('should not show welcome message and logout button when not logged in', () => {
    // Simule l'état non connecté
    spyOnProperty(authService, 'isLoggedIn', 'get').and.returnValue(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.welcome-message')).toBeFalsy();
    expect(compiled.querySelector('button.btn-primary')).toBeFalsy();
  });

  /**
   * Teste que le message de bienvenue et le bouton de déconnexion sont affichés
   * lorsque l'utilisateur est connecté.
   */
  it('should show welcome message and logout button when logged in', () => {
    const mockUser: User = { id: 1, nom: 'test', email: 'test@test.com' };
    // Simule l'état connecté
    spyOnProperty(authService, 'isLoggedIn', 'get').and.returnValue(true);
    spyOnProperty(authService, 'user', 'get').and.returnValue(mockUser);
    
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const welcomeMessageElement = compiled.querySelector('.welcome-message');
    expect(welcomeMessageElement).toBeTruthy();
    expect(welcomeMessageElement?.textContent).toContain('Bienvenue');
    expect(welcomeMessageElement?.querySelector('strong')?.textContent).toContain('test');

    const logoutButton = compiled.querySelector('button.btn-primary');
    expect(logoutButton).toBeTruthy();
    expect(logoutButton?.textContent).toContain('Déconnexion');

    expect(compiled.querySelector('a[routerLink="/login"]')).toBeFalsy();
    expect(compiled.querySelector('a[routerLink="/signin"]')).toBeFalsy();
  });

  /**
   * Teste si la méthode logout est appelée et la navigation vers /login est effectuée
   * lorsque le bouton de déconnexion est cliqué.
   */
  it('should call logout and navigate to /login when logout button is clicked', () => {
    const mockUser: User = { id: 1, nom: 'test', email: 'test@test.com' };
    spyOnProperty(authService, 'isLoggedIn', 'get').and.returnValue(true);
    spyOnProperty(authService, 'user', 'get').and.returnValue(mockUser);
    const logoutSpy = spyOn(authService, 'logout');
    const navigateSpy = spyOn(component['router'], 'navigate');

    fixture.detectChanges();

    const logoutButton = fixture.debugElement.query(By.css('button.btn-primary')).nativeElement;
    logoutButton.click();

    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});