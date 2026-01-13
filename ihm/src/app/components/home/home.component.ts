import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Composant de la page d'accueil de l'application.
 * Gère la redirection des utilisateurs connectés vers le tableau de bord
 * et affiche les options de connexion/inscription pour les utilisateurs non connectés.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  /**
   * Indique si le chargement initial de la page est en cours.
   */
  isLoading = true;

  /**
   * Constructeur du HomeComponent.
   * @param authService Le service d'authentification pour vérifier l'état de connexion de l'utilisateur.
   * @param router Le service Router pour la navigation.
   */
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  /**
   * Méthode du cycle de vie ngOnInit.
   * Vérifie si l'utilisateur est connecté et redirige vers le tableau de bord si c'est le cas.
   * Sinon, la page d'accueil est affichée.
   */
  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.isLoading = false;
    }
  }
}
