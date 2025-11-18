import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: User | null = null;
  
  public get isLoggedIn(): boolean {
    return !!this._user;
  }

  public get user(): User | null {
    return this._user;
  }

  constructor() { }

  login(user: User) {
    this._user = user;
  }

  logout() {
    this._user = null;
  }

  isAuthenticated() {
    return this.isLoggedIn;
  }
}
