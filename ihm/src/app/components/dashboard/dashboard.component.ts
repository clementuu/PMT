import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectListComponent } from '../project-list/project-list.component';

/**
 * Composant du tableau de bord affichant la liste des projets et permettant la navigation.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProjectListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  /**
   * Constructeur du DashboardComponent.
   * @param router Le service Router pour la navigation.
   */
  constructor(private router: Router) {}

  /**
   * Navigue vers la page de création d'un nouveau projet.
   */
  goToNewProject() {
    this.router.navigate(['/new-project']);
  }
}