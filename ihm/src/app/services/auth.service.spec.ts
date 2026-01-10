import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let mockUser: User;

  beforeEach(() => {
    mockUser = { id: 1, nom: 'Test User', email: 'test@example.com' };

    // Mock localStorage for each test
    const localStorageMock = {
      getItem: jasmine.createSpy('getItem').and.returnValue(null),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem'),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    TestBed.configureTestingModule({});
    // Removed service = TestBed.inject(AuthService); from beforeEach
  });

  it('should be created', () => {
    const service = new AuthService(); // Create service instance here
    expect(service).toBeTruthy();
  });

  // --- Initialization Tests ---
  it('should have _user as null initially if no user in localStorage', () => {
    const service = new AuthService(); // Create service instance here
    expect(service.user).toBeNull();
    expect(service.isLoggedIn).toBeFalse();
    expect(localStorage.getItem).toHaveBeenCalledWith('pmt_user');
  });

  it('should load _user from localStorage on initialization if present', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockUser));
    
    // Create service instance AFTER setting up the localStorage mock
    const service = new AuthService();

    expect(service.user).toEqual(mockUser);
    expect(service.isLoggedIn).toBeTrue();
    expect(localStorage.getItem).toHaveBeenCalledWith('pmt_user');
  });

  // --- login(user) method Tests ---
  it('should set _user and store in localStorage on login', () => {
    const service = new AuthService(); // Create service instance here
    service.login(mockUser);

    expect(service.user).toEqual(mockUser);
    expect(service.isLoggedIn).toBeTrue();
    expect(localStorage.setItem).toHaveBeenCalledWith('pmt_user', JSON.stringify(mockUser));
  });

  // --- logout() method Tests ---
  it('should clear _user and remove from localStorage on logout', () => {
    const service = new AuthService(); // Create service instance here
    // First, log in a user to have a state to clear
    service.login(mockUser);
    expect(service.isLoggedIn).toBeTrue();

    service.logout();

    expect(service.user).toBeNull();
    expect(service.isLoggedIn).toBeFalse();
    expect(localStorage.removeItem).toHaveBeenCalledWith('pmt_user');
  });

  // --- isLoggedIn and isAuthenticated() getters Tests ---
  it('should return true for isLoggedIn and isAuthenticated when user is logged in', () => {
    const service = new AuthService(); // Create service instance here
    service.login(mockUser);
    expect(service.isLoggedIn).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false for isLoggedIn and isAuthenticated when user is logged out', () => {
    const service = new AuthService(); // Create service instance here
    service.logout(); // Ensure initially logged out state
    expect(service.isLoggedIn).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
