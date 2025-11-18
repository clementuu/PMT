import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';

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

  it('should show login and signin buttons when not logged in', () => {
    authService.logout();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[routerLink="/login"]')).toBeTruthy();
    expect(compiled.querySelector('a[routerLink="/signin"]')).toBeTruthy();
    expect(compiled.querySelector('.welcome-message')).toBeFalsy();
    expect(compiled.querySelector('button.nav-button')).toBeFalsy();
  });

  it('should show welcome message and logout button when logged in', () => {
    authService.login('test@test.com');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.welcome-message')).toBeTruthy();
    expect(compiled.querySelector('.welcome-message')?.textContent).toContain('Bienvenue test !');
    expect(compiled.querySelector('button.nav-button')?.textContent).toContain('Déconnexion');
    expect(compiled.querySelector('a[routerLink="/login"]')).toBeFalsy();
    expect(compiled.querySelector('a[routerLink="/signin"]')).toBeFalsy();
  });
});
