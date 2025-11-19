import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoginRequest, SigninRequest } from '../../models/requests.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  nom = '';
  email = '';
  password = '';
  confirmPassword = '';
  signinError: string | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.signinError = null;

    const signinRequest: SigninRequest = {
      nom: this.nom,
      email: this.email,
      mdp: this.password
    };

    this.apiService.postUser(signinRequest).subscribe({
      next: (user) => {
        const loginRequest: LoginRequest = {
          email: this.email,
          mdp: this.password
        };
        this.apiService.postLogin(loginRequest).subscribe({
          next: (loginResponse) => {
            if(loginResponse.user) { 
              this.authService.login(loginResponse.user);
              this.router.navigate(['/dashboard']);
            }
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.signinError = "Une erreur s'est produite lors de la connexion automatique.";
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.signinError = "Une erreur s'est produite lors de l'inscription.";
        console.error(err);
      }
    });
  }
}