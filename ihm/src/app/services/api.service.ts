import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginRequest, LoginResponse, SigninRequest } from '../models/requests.model';
import { User } from '../models/user.model';

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = "http://localhost:8080"

  constructor(private httpClient: HttpClient) {}

  postLogin(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/user/login`, loginRequest)
      .pipe(
        catchError(this.catchError)
      );
  }

  postUser(signinRequest: SigninRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/user`, signinRequest)
      .pipe(
        catchError(this.catchError)
      );
  }

  catchError(error: HttpErrorResponse) {
    const apiError: ApiError = {
      message: error.message || "Une erreur inconnue s'est produite",
      status: error.status,
      details: error.error ?? "Aucune information sur l'erreur"
    };
    alert("Erreur API: "+apiError.details.error); 
    return throwError(() => apiError);
  }
}
