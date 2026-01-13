import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoginRequest, SigninRequest } from '../../models/requests.model';
import { AuthService } from '../../services/auth.service';
import { switchMap } from 'rxjs/operators';

/**
 * Composant d'inscription des nouveaux utilisateurs.
 * Permet aux utilisateurs de créer un nouveau compte et de se connecter automatiquement après l'inscription.
 */
@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  /**
   * Nom de l'utilisateur pour l'inscription.
   */
  nom = '';
  /**
   * Email de l'utilisateur pour l'inscription et la connexion.
   */
  email = '';
  /**
   * Mot de passe de l'utilisateur pour l'inscription et la connexion.
   */
  password = '';
  /**
   * Confirmation du mot de passe saisi par l'utilisateur.
   */
  confirmPassword = '';
  /**
   * Message d'erreur affiché en cas d'échec de l'inscription ou de la connexion.
   */
  signinError: string | null = null;

  /**
   * Constructeur du SigninComponent.
   * @param router Le service Router pour la navigation.
   * @param apiService Le service API pour l'inscription et la connexion.
   * @param authService Le service d'authentification pour gérer l'état de connexion.
   */
  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  /**
   * Gère la soumission du formulaire d'inscription.
   * Tente d'inscrire l'utilisateur, puis de le connecter, et redirige vers le tableau de bord en cas de succès.
   * Affiche un message d'erreur en cas d'échec.
   */
  onSubmit() {
    this.signinError = null;

    const signinRequest: SigninRequest = {
      nom: this.nom,
      email: this.email,
      mdp: this.password
    };

    this.apiService.postUser(signinRequest).pipe(
      switchMap(user => {
        const loginRequest: LoginRequest = {
          email: this.email,
          mdp: this.password
        };
        return this.apiService.postLogin(loginRequest);
      })
    ).subscribe({
      next: loginResponse => {
        if (loginResponse && loginResponse.user) {
          this.authService.login(loginResponse.user);
          this.router.navigate(['/dashboard']);
        } else {
          this.signinError = "La connexion a échoué: utilisateur non retourné.";
          this.router.navigate(['/login']);
        }
      },
      error: err => {
        this.signinError = "Une erreur s'est produite.";
        console.error(err);
      }
    });
  }
}