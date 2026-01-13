import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import CommonModule and DatePipe
import { Historique } from '../../models/historique.model';
import { ApiService } from '../../services/api.service'; // Use ApiService

/**
 * Composant d'affichage de l'historique des modifications pour un projet ou une tâche.
 * Il récupère et affiche la liste des événements historiques.
 */
@Component({
  selector: 'app-historique',
  standalone: true, // Mark as standalone
  imports: [CommonModule, DatePipe], // Import necessary modules
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnChanges {
  /**
   * L'ID du projet pour lequel afficher l'historique.
   * Optionnel, utilisé si l'historique est lié à un projet.
   */
  @Input() projectId?: number;
  /**
   * L'ID de la tâche pour laquelle afficher l'historique.
   * Optionnel, utilisé si l'historique est lié à une tâche.
   */
  @Input() taskId?: number;

  /**
   * Liste des événements historiques à afficher.
   */
  historiques: Historique[] = [];

  /**
   * Constructeur du HistoriqueComponent.
   * @param apiService Le service API pour récupérer les données historiques.
   */
  constructor(private apiService: ApiService) { } // Inject ApiService

  /**
   * Gère les changements sur les propriétés d'entrée (projectId, taskId).
   * Appelle `loadHistory` si projectId ou taskId change.
   * @param changes Objet SimpleChanges contenant les changements des propriétés.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['projectId'] && this.projectId) || (changes['taskId'] && this.taskId)) {
      this.loadHistory();
    }
  }

  /**
   * Charge l'historique des modifications en fonction du projectId ou du taskId fourni.
   * Met à jour la propriété `historiques` avec les données récupérées.
   */
  public loadHistory(): void {
    if (this.projectId) {
      this.apiService.getHistoriqueForProject(this.projectId).subscribe(data => {
        this.historiques = data;
      });
    } else if (this.taskId) {
      this.apiService.getHistoriqueForTask(this.taskId).subscribe(data => {
        this.historiques = data;
      });
    }
  }
}