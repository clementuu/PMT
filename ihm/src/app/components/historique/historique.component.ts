import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import CommonModule and DatePipe
import { Historique } from '../../models/historique.model';
import { ApiService } from '../../services/api.service'; // Use ApiService

@Component({
  selector: 'app-historique',
  standalone: true, // Mark as standalone
  imports: [CommonModule, DatePipe], // Import necessary modules
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnChanges {
  @Input() projectId?: number;
  @Input() taskId?: number;

  historiques: Historique[] = [];

  constructor(private apiService: ApiService) { } // Inject ApiService

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['projectId'] && this.projectId) || (changes['taskId'] && this.taskId)) {
      this.loadHistory();
    }
  }

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