import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { LoginRequest } from '../../models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  loginError: string | null = null;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  onSubmit() {
    if (this.email && this.password) {
      const loginRequest: LoginRequest = { email: this.email, mdp: this.password };
      
      this.apiService.postLogin(loginRequest).subscribe({
        next: (isLoggedIn) => {
          if (isLoggedIn) {
            this.authService.login(this.email);
            this.router.navigate(['/dashboard']);
          } else {
            this.loginError = 'Email ou mot de passe incorrect.';
          }
        },
        error: (err) => {
          this.loginError = "Une erreur s'est produite lors de la connexion.";
          console.error(err);
        }
      });
    }
  }
}