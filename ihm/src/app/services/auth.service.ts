import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: User | null = null;
  private readonly USER_STORAGE_KEY = 'pmt_user';

  public get isLoggedIn(): boolean {
    return !!this._user;
  }

  public get user(): User | null {
    return this._user;
  }

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
      if (storedUser) {
        this._user = JSON.parse(storedUser);
      }
    }
  }

  login(user: User) {
    this._user = user;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
    }
  }

  logout() {
    this._user = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.USER_STORAGE_KEY);
    }
  }

  isAuthenticated() {
    return this.isLoggedIn;
  }
}
