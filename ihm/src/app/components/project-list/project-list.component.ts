import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project.model';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Composant d'affichage de la liste des projets.
 * Récupère et affiche les projets associés à l'utilisateur connecté.
 */
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  /**
   * Un Observable contenant la liste des projets de l'utilisateur connecté.
   */
  projects$!: Observable<Project[]>;

  /**
   * Constructeur du ProjectListComponent.
   * @param apiService Le service API pour récupérer les projets.
   * @param authService Le service d'authentification pour obtenir l'ID de l'utilisateur.
   * @param router Le service Router pour la navigation.
   */
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Méthode du cycle de vie ngOnInit.
   * Charge les projets de l'utilisateur connecté lors de l'initialisation du composant.
   */
  ngOnInit(): void {
    const user = this.authService.user;
    if (user) {
      this.projects$ = this.apiService.getProjectsByUserId(user.id);
    }
  }

  /**
   * Navigue vers la page de détail d'un projet spécifique.
   * @param projectId L'ID du projet vers lequel naviguer.
   */
  goToProject(projectId: number): void {
    this.router.navigate(['/project', projectId]);
  }
}
