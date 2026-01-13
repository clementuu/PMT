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
   * Cette méthode est appelée lors de l'initialisation du service.
   */
  private loadUserFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
      if (storedUser) {
        this._user = JSON.parse(storedUser);
      }
    }
  }

  /**
   * Connecte un utilisateur en stockant ses informations et en les persistant dans le stockage local.
   * @param user L'objet utilisateur à connecter.
   */
  login(user: User) {
    this._user = user;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
    }
  }

  /**
   * Déconnecte l'utilisateur en supprimant ses informations et en les retirant du stockage local.
   */
  logout() {
    this._user = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.USER_STORAGE_KEY);
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