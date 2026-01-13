import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { LoginRequest } from '../../models/requests.model';

/**
 * Composant de connexion des utilisateurs.
 * Permet aux utilisateurs de se connecter à l'application en utilisant leur email et mot de passe.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  /**
   * Email de l'utilisateur pour la connexion.
   */
  email = '';
  /**
   * Mot de passe de l'utilisateur pour la connexion.
   */
  password = '';
  /**
   * Message d'erreur affiché en cas d'échec de la connexion.
   */
  loginError: string | null = null;

  /**
   * Constructeur du LoginComponent.
   * @param router Le service Router pour la navigation après connexion.
   * @param authService Le service d'authentification pour gérer l'état de connexion.
   * @param apiService Le service API pour effectuer la requête de connexion.
   */
  constructor(
    private router: Router, 
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  /**
   * Gère la soumission du formulaire de connexion.
   * Tente de connecter l'utilisateur via l'ApiService et redirige vers le tableau de bord en cas de succès.
   * Affiche un message d'erreur en cas d'échec.
   */
  onSubmit() {
    if (this.email && this.password) {
      const loginRequest: LoginRequest = { email: this.email, mdp: this.password };
      
      this.apiService.postLogin(loginRequest).subscribe({
        next: (response) => {
          if (response.success && response.user) {
            this.authService.login(response.user);
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