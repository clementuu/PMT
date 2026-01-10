import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockAuthService: Partial<AuthService>;
  let router: Router;

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to dashboard if user is logged in', () => {
    Object.defineProperty(mockAuthService, 'isLoggedIn', { get: () => true });
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not redirect if user is not logged in', () => {
    Object.defineProperty(mockAuthService, 'isLoggedIn', { get: () => false });
    component.ngOnInit();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should show login and signin buttons when not logged in', () => {
    Object.defineProperty(mockAuthService, 'isLoggedIn', { get: () => false });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[routerLink="/login"]')).toBeTruthy();
    expect(compiled.querySelector('a[routerLink="/signin"]')).toBeTruthy();
  });

  it('should not show login and signin buttons when logged in', () => {
    Object.defineProperty(mockAuthService, 'isLoggedIn', { get: () => true });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // In this case, the component should redirect, so we might not even have these buttons.
    // However, if for some reason redirection doesn't happen, they should not be visible.
    expect(compiled.querySelector('a[routerLink="/login"]')).toBeFalsy();
    expect(compiled.querySelector('a[routerLink="/signin"]')).toBeFalsy();
  });
});
