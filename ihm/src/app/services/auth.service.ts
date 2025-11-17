import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = false;
  
  public get isLoggedIn() {
    return this._isLoggedIn;
  }

  constructor() { }

  login() {
    this._isLoggedIn = true;
  }

  logout() {
    this._isLoggedIn = false;
  }

  isAuthenticated() {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(this.isLoggedIn);
      }, 1000)
    })
  }
}
