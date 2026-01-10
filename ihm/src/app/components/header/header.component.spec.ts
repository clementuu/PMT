import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { By } from '@angular/platform-browser'; // Import By

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show welcome message and logout button when not logged in', () => {
    // Simulate not logged in
    spyOnProperty(authService, 'isLoggedIn', 'get').and.returnValue(false);
    // authService.logout(); // No need to call logout here, just set the state
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.welcome-message')).toBeFalsy();
    expect(compiled.querySelector('button.btn-primary')).toBeFalsy(); // Corrected selector
  });

  it('should show welcome message and logout button when logged in', () => {
    const mockUser: User = { id: 1, nom: 'test', email: 'test@test.com' };
    // Simulate logged in
    spyOnProperty(authService, 'isLoggedIn', 'get').and.returnValue(true);
    spyOnProperty(authService, 'user', 'get').and.returnValue(mockUser);
    
    // Manual set `component.username` removed, as it's a getter
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const welcomeMessageElement = compiled.querySelector('.welcome-message');
    expect(welcomeMessageElement).toBeTruthy();
    // Check for parts of the text content, accounting for <br> and <strong>
    expect(welcomeMessageElement?.textContent).toContain('Bienvenue');
    expect(welcomeMessageElement?.querySelector('strong')?.textContent).toContain('test');

    const logoutButton = compiled.querySelector('button.btn-primary'); // Corrected selector
    expect(logoutButton).toBeTruthy();
    expect(logoutButton?.textContent).toContain('Déconnexion');

    // Ensure login/signin links are not present (based on the HTML, they are not present at all)
    expect(compiled.querySelector('a[routerLink="/login"]')).toBeFalsy();
    expect(compiled.querySelector('a[routerLink="/signin"]')).toBeFalsy();
  });

  it('should call logout and navigate to /login when logout button is clicked', () => {
    const mockUser: User = { id: 1, nom: 'test', email: 'test@test.com' };
    spyOnProperty(authService, 'isLoggedIn', 'get').and.returnValue(true);
    spyOnProperty(authService, 'user', 'get').and.returnValue(mockUser);
    // Manual set `component.username` removed, as it's a getter
    const logoutSpy = spyOn(authService, 'logout');
    const navigateSpy = spyOn(component['router'], 'navigate'); // Spy on the private router

    fixture.detectChanges();

    const logoutButton = fixture.debugElement.query(By.css('button.btn-primary')).nativeElement;
    logoutButton.click();

    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
