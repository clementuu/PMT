import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Composant d'en-tête (header) de l'application.
 * Il affiche le nom d'utilisateur et gère la déconnexion.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  /**
   * Constructeur du HeaderComponent.
   * @param authService Le service d'authentification pour gérer l'état de connexion de l'utilisateur.
   * @param router Le service Router pour la navigation.
   */
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  /**
   * Retourne le nom d'utilisateur de l'utilisateur connecté.
   * Si aucun utilisateur n'est connecté, une chaîne vide est retournée.
   */
  get username(): string {
    return this.authService.user?.nom ?? '';
  }

  /**
   * Déconnecte l'utilisateur et navigue vers la page de connexion.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}