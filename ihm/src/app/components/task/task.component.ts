import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Task } from '../../models/task.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskAssignComponent } from '../task-assign/task-assign.component';
import { HistoriqueComponent } from "../historique/historique.component";
import { AuthService } from '../../services/auth.service';
import { Observable, of, switchMap, tap } from 'rxjs';

/**
 * Composant de gestion des tâches individuelles.
 * Affiche les détails d'une tâche, permet son édition, l'assignation,
 * la suppression et l'affichage de l'historique des modifications.
 */
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TaskAssignComponent, HistoriqueComponent], // Add TaskAssignComponent here
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  /**
   * Référence au composant Historique enfant.
   */
  @ViewChild(HistoriqueComponent) historiqueComponent!: HistoriqueComponent;

  /**
   * La tâche actuellement affichée.
   */
  task: Task | null = null;
  /**
   * Indique si le mode édition de la tâche est activé.
   */
  isEditing = false;
  /**
   * Formulaire réactif pour l'édition des détails de la tâche.
   */
  taskForm: FormGroup;
  /**
   * Rôle de l'utilisateur actuel dans le projet de la tâche.
   */
  currentUserRole: string | null = null;

  // Enums
  /**
   * Priorités de tâche disponibles.
   */
  priorities: Task['priorite'][] = ['LOW', 'MEDIUM', 'HIGH'];
  /**
   * Statuts de tâche disponibles.
   */
  statuses: Task['status'][] = ['TODO', 'IN_PROGRESS', 'DONE'];

  // Mappings pour l'affichage
  /**
   * Mapping des noms de priorité pour un affichage convivial.
   */
  priorityDisplayNames: { [key: string]: string } = {
    'LOW': 'Faible',
    'MEDIUM': 'Moyenne',
    'HIGH': 'Importante'
  };

  /**
   * Mapping des noms de statut pour un affichage convivial.
   */
  statusDisplayNames: { [key: string]: string } = {
    'TODO': 'À faire',
    'IN_PROGRESS': 'En cours',
    'DONE': 'Terminé'
  };

  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  /**
   * Constructeur du TaskComponent.
   * @param router Le service Router pour la navigation.
   */
  constructor(private router: Router) {
    this.taskForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dateEcheance: ['', Validators.required],
      priorite: ['MEDIUM', Validators.required],
      status: ['TODO', Validators.required]
    });
  }

  /**
   * Méthode du cycle de vie ngOnInit.
   * Charge la tâche à afficher lorsque le composant est initialisé.
   */
  ngOnInit(): void {
    this.loadTask().subscribe(); // Subscribe to the observable
  }

  /**
   * Charge les données de la tâche à partir de l'ID présent dans l'URL.
   * Met à jour la tâche, recharge l'historique et récupère le rôle de l'utilisateur.
   * @returns Un Observable de la tâche chargée.
   */
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

  /**
   * Gère l'événement d'assignation d'une tâche.
   * Recharge la tâche pour refléter le nouvel utilisateur assigné.
   */
  onTaskAssigned(): void {
    // Reload the task to reflect the assigned user
    this.loadTask().subscribe(); // Subscribe to the observable
  }

  /**
   * Active le mode édition de la tâche et pré-remplit le formulaire avec les données actuelles de la tâche.
   */
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

  /**
   * Annule le mode édition de la tâche.
   */
  cancelEdit(): void {
    this.isEditing = false;
  }

  /**
   * Met à jour les informations de la tâche.
   * Envoie les données modifiées au backend via l'ApiService.
   */
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

  /**
   * Supprime la tâche actuelle après confirmation.
   * Redirige vers la page du projet après la suppression.
   */
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

  /**
   * Retourne le nom d'affichage convivial pour une priorité donnée.
   * @param priority La priorité de la tâche.
   * @returns Le nom d'affichage de la priorité.
   */
  getPriorityDisplayName(priority: string): string {
    return this.priorityDisplayNames[priority] || priority;
  }

  /**
   * Retourne le nom d'affichage convivial pour un statut donné.
   * @param status Le statut de la tâche.
   * @returns Le nom d'affichage du statut.
   */
  getStatusDisplayName(status: string): string {
    return this.statusDisplayNames[status] || status;
  }
}

