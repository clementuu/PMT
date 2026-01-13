import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { User } from '../models/user.model';

/**
 * Suite de tests pour le service AuthService.
 */
describe('AuthService', () => {
  /**
   * Utilisateur mocké pour les tests.
   */
  let mockUser: User;

  /**
   * Configure l'environnement de test avant chaque test.
   */
  beforeEach(() => {
    mockUser = { id: 1, nom: 'Test User', email: 'test@example.com' };

    // Mock localStorage pour chaque test afin d'isoler l'environnement.
    const localStorageMock = {
      getItem: jasmine.createSpy('getItem').and.returnValue(null),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem'),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    TestBed.configureTestingModule({});
  });

  /**
   * Teste si le service est créé avec succès.
   */
  it('should be created', () => {
    const service = new AuthService();
    expect(service).toBeTruthy();
  });

  /**
   * Tests pour l'initialisation du service.
   */
  describe('Initialization Tests', () => {
    /**
     * Teste que `_user` est null initialement si aucun utilisateur n'est dans le stockage local.
     */
    it('should have _user as null initially if no user in localStorage', () => {
      const service = new AuthService();
      expect(service.user).toBeNull();
      expect(service.isLoggedIn).toBeFalse();
      expect(localStorage.getItem).toHaveBeenCalledWith('pmt_user');
    });

    /**
     * Teste que `_user` est chargé depuis le stockage local lors de l'initialisation si présent.
     */
    it('should load _user from localStorage on initialization if present', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(mockUser));
      
      const service = new AuthService();

      expect(service.user).toEqual(mockUser);
      expect(service.isLoggedIn).toBeTrue();
      expect(localStorage.getItem).toHaveBeenCalledWith('pmt_user');
    });
  });

  /**
   * Tests pour la méthode `login(user)`.
   */
  describe('login(user) method Tests', () => {
    /**
     * Teste que `_user` est défini et stocké dans le stockage local lors de la connexion.
     */
    it('should set _user and store in localStorage on login', () => {
      const service = new AuthService();
      service.login(mockUser);

      expect(service.user).toEqual(mockUser);
      expect(service.isLoggedIn).toBeTrue();
      expect(localStorage.setItem).toHaveBeenCalledWith('pmt_user', JSON.stringify(mockUser));
    });
  });

  /**
   * Tests pour la méthode `logout()`.
   */
  describe('logout() method Tests', () => {
    /**
     * Teste que `_user` est effacé et supprimé du stockage local lors de la déconnexion.
     */
    it('should clear _user and remove from localStorage on logout', () => {
      const service = new AuthService();
      service.login(mockUser);
      expect(service.isLoggedIn).toBeTrue();

      service.logout();

      expect(service.user).toBeNull();
      expect(service.isLoggedIn).toBeFalse();
      expect(localStorage.removeItem).toHaveBeenCalledWith('pmt_user');
    });
  });

  /**
   * Tests pour les accesseurs `isLoggedIn` et `isAuthenticated()`.
   */
  describe('isLoggedIn and isAuthenticated() getters Tests', () => {
    /**
     * Teste que `isLoggedIn` et `isAuthenticated` retournent true lorsqu'un utilisateur est connecté.
     */
    it('should return true for isLoggedIn and isAuthenticated when user is logged in', () => {
      const service = new AuthService();
      service.login(mockUser);
      expect(service.isLoggedIn).toBeTrue();
      expect(service.isAuthenticated()).toBeTrue();
    });

    /**
     * Teste que `isLoggedIn` et `isAuthenticated` retournent false lorsqu'un utilisateur est déconnecté.
     */
    it('should return false for isLoggedIn and isAuthenticated when user is logged out', () => {
      const service = new AuthService();
      service.logout();
      expect(service.isLoggedIn).toBeFalse();
      expect(service.isAuthenticated()).toBeFalse();
    });
  });
});