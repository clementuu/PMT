import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

/**
 * Service d'authentification pour gérer l'état de connexion de l'utilisateur.
 * Il gère la connexion, la déconnexion et la persistance des informations de l'utilisateur.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Utilisateur actuellement connecté. Est null si aucun utilisateur n'est connecté.
   */
  private _user: User | null = null;
  /**
   * Clé utilisée pour stocker les informations de l'utilisateur dans le stockage local.
   */
  private readonly USER_STORAGE_KEY = 'pmt_user';
  /**
   * Clé utilisée pour suivre la session active dans le stockage de session.
   */
  private readonly SESSION_STORAGE_KEY = 'pmt_session';

  /**
   * Retourne true si un utilisateur est connecté, false sinon.
   */
  public get isLoggedIn(): boolean {
    return !!this._user;
  }

  /**
   * Retourne l'utilisateur actuellement connecté.
   */
  public get user(): User | null {
    return this._user;
  }

  /**
   * Constructeur du service AuthService.
   * Charge les informations de l'utilisateur depuis le stockage local lors de l'initialisation.
   */
  constructor() {
    this.loadUserFromStorage();
  }

  /**
   * Charge les informations de l'utilisateur depuis le stockage local.
   * Si l'utilisateur est dans le stockage local mais que la session n'est pas active,
   * cela signifie que le navigateur a été fermé, donc l'utilisateur est déconnecté.
   */
  private loadUserFromStorage() {
    if (typeof localStorage !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
      if (storedUser) {
        if (sessionStorage.getItem(this.SESSION_STORAGE_KEY)) {
          this._user = JSON.parse(storedUser);
        } else {
          localStorage.removeItem(this.USER_STORAGE_KEY);
          this._user = null;
        }
      }
    }
  }

  /**
   * Connecte un utilisateur en stockant ses informations et en les persistant dans le stockage local et de session.
   * @param user L'objet utilisateur à connecter.
   */
  login(user: User) {
    this._user = user;
    if (typeof localStorage !== 'undefined' && typeof sessionStorage !== 'undefined') {
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, 'active');
    }
  }

  /**
   * Déconnecte l'utilisateur en supprimant ses informations des stockages local et de session.
   */
  logout() {
    this._user = null;
    if (typeof localStorage !== 'undefined' && typeof sessionStorage !== 'undefined') {
      localStorage.removeItem(this.USER_STORAGE_KEY);
      sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
    }
  }

  /**
   * Vérifie si un utilisateur est authentifié (connecté).
   * @returns true si un utilisateur est connecté, false sinon.
   */
  isAuthenticated() {
    return this.isLoggedIn;
  }
}