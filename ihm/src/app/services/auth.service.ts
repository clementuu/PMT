import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = false;
  private _userEmail = "";
  
  public get isLoggedIn() {
    return this._isLoggedIn;
  }

  public get userEmail() {
    return this._userEmail;
  }

  constructor() { }

  login(email: string) {
    this._userEmail = email;
    this._isLoggedIn = true;
  }

  logout() {
    this._isLoggedIn = false;
  }

  getUserEmail() {
    return this.userEmail;
  }

  isAuthenticated() {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(this.isLoggedIn);
      }, 1000)
    })
  }
}
