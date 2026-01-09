import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Task } from '../../models/task.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskAssignComponent } from '../task-assign/task-assign.component';
import { HistoriqueComponent } from "../historique/historique.component"; // Import TaskAssignComponent

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TaskAssignComponent, HistoriqueComponent], // Add TaskAssignComponent here
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  task: Task | null = null;
  isEditing = false;
  taskForm: FormGroup;

  // Enums
  priorities: Task['priorite'][] = ['LOW', 'MEDIUM', 'HIGH'];
  statuses: Task['status'][] = ['TODO', 'IN_PROGRESS', 'DONE'];

  // Mappings pour l'affichage
  priorityDisplayNames: { [key: string]: string } = {
    'LOW': 'Faible',
    'MEDIUM': 'Moyenne',
    'HIGH': 'Importante'
  };

  statusDisplayNames: { [key: string]: string } = {
    'TODO': 'À faire',
    'IN_PROGRESS': 'En cours',
    'DONE': 'Terminé'
  };

  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  constructor(private router: Router) {
    this.taskForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dateEcheance: ['', Validators.required],
      priorite: ['MEDIUM', Validators.required],
      status: ['TODO', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTask(); // Use a dedicated method to load task
  }

  loadTask(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.apiService.getTask(+id).subscribe({
          next: (task: Task) => {
            this.task = task;
          },
          error: (error) => console.error('Error fetching task details:', error)
        });
      }
    });
  }

  onTaskAssigned(): void {
    // Reload the task to reflect the assigned user
    this.loadTask();
  }

  startEditing(): void {
    if (!this.task) return;
    this.isEditing = true;
    this.taskForm.setValue({
      nom: this.task.nom,
      description: this.task.description,
      // Format date for the input[type="date"]
      dateEcheance: formatDate(this.task.dateEcheance, 'yyyy-MM-dd', 'en'),
      priorite: this.task.priorite,
      status: this.task.status
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  updateTask(): void {
    if (!this.task || this.taskForm.invalid) {
      return;
    }

    const updatedTaskData: Task = {
      ...this.task,
      ...this.taskForm.value,
      dateEcheance: new Date(this.taskForm.value.dateEcheance) // Ensure date is a Date object
    };

    this.apiService.updateTask(updatedTaskData).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask;
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Error updating task:', err);
        alert("Erreur lors de la mise à jour de la tâche !");
      }
    });
  }

  deleteTask(): void {
    if (this.task == null) {
      return;
    }

    this.apiService.deleteTask(this.task.id).subscribe({
      next: () => {
        alert("Tâche supprimé !");
        this.router.navigate([`/project/${this.task?.projectId}`]);
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        alert("Erreur lors de la suppression de la tâche !");
      }
    })
  }

  // Method to get the display name for priority
  getPriorityDisplayName(priority: string): string {
    return this.priorityDisplayNames[priority] || priority;
  }

  // Method to get the display name for status
  getStatusDisplayName(status: string): string {
    return this.statusDisplayNames[status] || status;
  }
}

