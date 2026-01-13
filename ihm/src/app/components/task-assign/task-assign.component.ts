import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Assigned, User } from '../../models/user.model';

/**
 * Composant de gestion de l'assignation des tâches aux utilisateurs.
 * Permet d'assigner et de désassigner des utilisateurs à une tâche spécifique
 * au sein d'un projet.
 */
@Component({
  selector: 'app-task-assign',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-assign.component.html',
  styleUrl: './task-assign.component.css',
})
export class TaskAssignComponent implements OnInit {
  /**
   * ID de la tâche à laquelle les utilisateurs doivent être assignés.
   */
  @Input() taskId!: number;
  /**
   * ID du projet auquel la tâche appartient.
   */
  @Input() projectId!: number;
  /**
   * Rôle de l'utilisateur actuel dans le projet.
   */
  @Input() currentUserRole: string | null = null;
  /**
   * Événement émis lorsque la tâche a été assignée avec succès.
   */
  @Output() taskAssigned = new EventEmitter<void>();

  /**
   * Liste des utilisateurs du projet disponibles pour être assignés à la tâche.
   */
  users: User[] = [];
  /**
   * L'ID de l'utilisateur sélectionné pour l'assignation.
   */
  selectedUserId: number | undefined;
  /**
   * Liste des utilisateurs déjà assignés à la tâche.
   */
  assigned: Assigned[] = [];

  /**
   * Constructeur du TaskAssignComponent.
   * @param apiService Le service API pour interagir avec le backend.
   */
  constructor(private apiService: ApiService) {}

  /**
   * Méthode du cycle de vie ngOnInit.
   * Charge les utilisateurs du projet et les utilisateurs déjà assignés à la tâche.
   */
  ngOnInit(): void {
    this.loadProjectUsers();
    this.loadAssignedUsers();
  }

  /**
   * Charge la liste des utilisateurs qui font partie du projet.
   */
  loadProjectUsers(): void {
    this.apiService.getUsersByProjectId(this.projectId).subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
      },
    });
  }

  /**
   * Charge la liste des utilisateurs déjà assignés à la tâche.
   */
  loadAssignedUsers(): void {
    if (this.taskId) {
      this.apiService.getAllAssigned(this.taskId).subscribe({
        next: (data) => {
          this.assigned = data;
        },
        error: (err) => {
          console.error("getting assigned", err);
        }
      });
    }
  }

  /**
   * Assignee la tâche à l'utilisateur sélectionné.
   * Émet l'événement `taskAssigned` en cas de succès et rafraîchit les listes.
   */
  assignTask(): void {
    if (this.taskId && this.selectedUserId) {
      this.apiService.assignTaskToUser(this.taskId, this.selectedUserId).subscribe({
        next: () => {
          this.taskAssigned.emit();
          this.selectedUserId = undefined; // Reset selection
          this.loadAssignedUsers(); // Refresh assigned users list
          this.loadProjectUsers(); // Refresh available users list
        },
        error: (err) => {
          console.error('Failed to assign task', err);
          alert('Failed to assign task: ' + (err.details?.error || err.message));
        },
      });
    } else {
      alert('Please select a user to assign the task.');
    }
  }

  /**
   * Désassigne un utilisateur de la tâche.
   * Rafraîchit les listes après la désassignation.
   * @param id L'ID de l'assignation (Assigned) à supprimer.
   */
  unassignUser(id: number): void {
    if (this.taskId) {
      this.apiService.unassignTaskFromUser(id).subscribe({
        next: () => {
          this.loadAssignedUsers();
          this.loadProjectUsers();
        },
        error: (err) => {
          console.error('Failed to unassign user', err);
          alert('Failed to unassign user: ' + (err.details?.error || err.message));
        },
      });
    }
  }
}
