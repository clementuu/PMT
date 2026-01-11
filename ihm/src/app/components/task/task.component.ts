import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Task } from '../../models/task.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskAssignComponent } from '../task-assign/task-assign.component';
import { HistoriqueComponent } from "../historique/historique.component"; // Import TaskAssignComponent
import { AuthService } from '../../services/auth.service';
import { Observable, of, switchMap, tap } from 'rxjs'; // Import switchMap and tap
import { UserRole } from '../../models/userProject.model'; // Import UserRole

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TaskAssignComponent, HistoriqueComponent], // Add TaskAssignComponent here
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @ViewChild(HistoriqueComponent) historiqueComponent!: HistoriqueComponent;

  task: Task | null = null;
  isEditing = false;
  taskForm: FormGroup;
  currentUserRole: string | null = null; // New property for current user's role

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
  private authService = inject(AuthService);

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
    this.loadTask().subscribe(); // Subscribe to the observable
  }

  loadTask(): Observable<Task> {
    return this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.apiService.getTask(+id).pipe(
            tap(task => {
              this.task = task;
              if (this.historiqueComponent) {
                this.historiqueComponent.loadHistory();
              }

              // Fetch current user's role for this project
              if (this.authService.user && this.task.projectId) {
                this.apiService.getUsersProject(this.task.projectId).subscribe(usersProject => {
                  const userRole = usersProject.users.find(up => up.userId === this.authService.user?.id);
                  this.currentUserRole = userRole ? userRole.role : null;
                });
              }
            })
          );
        } else {
          return of(null as any); // Return an observable of null if no ID
        }
      })
    );
  }

  onTaskAssigned(): void {
    // Reload the task to reflect the assigned user
    this.loadTask().subscribe(); // Subscribe to the observable
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
      dateEcheance: new Date(this.taskForm.value.dateEcheance), // Ensure date is a Date object
      userId: this.authService.user?.id
    };

    this.apiService.updateTask(updatedTaskData).subscribe({
      next: (updatedTask) => {
        this.isEditing = false;
        this.loadTask().subscribe(); // Explicitly reload the task after successful update
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

