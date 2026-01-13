import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';

/**
 * Composant pour la création d'une nouvelle tâche.
 * Permet aux utilisateurs de définir les détails d'une tâche et de l'associer à un projet existant.
 */
@Component({
  selector: 'app-task-new',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './task-new.component.html',
  styleUrls: ['./task-new.component.css']
})
export class TaskNewComponent implements OnInit {
  /**
   * Formulaire réactif pour la création d'une nouvelle tâche.
   */
  taskForm: FormGroup;
  /**
   * L'ID du projet auquel la nouvelle tâche sera associée.
   */
  projectId!: number;
  /**
   * Priorités de tâche disponibles.
   */
  priorities: Task['priorite'][] = ['LOW', 'MEDIUM', 'HIGH'];

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
   * Constructeur du TaskNewComponent.
   * @param fb Le FormBuilder pour créer le formulaire réactif.
   * @param route Le service ActivatedRoute pour accéder aux paramètres de l'URL.
   * @param router Le service Router pour la navigation après la création de la tâche.
   * @param apiService Le service API pour créer la tâche.
   */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.taskForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dateEcheance: [''],
      priorite: ['MEDIUM', Validators.required]
    });
  }

  /**
   * Méthode du cycle de vie ngOnInit.
   * Récupère l'ID du projet depuis l'URL.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId = +id;
    } else {
      // Handle error: project ID is not present
      console.error('Project ID is missing!');
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Gère la soumission du formulaire de création de tâche.
   * Crée la tâche via l'ApiService et redirige vers la page du projet en cas de succès.
   */
  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData: Partial<Task> = {
        ...this.taskForm.value,
        projectId: this.projectId,
        status: 'TODO'
      };

      this.apiService.createTask(taskData).subscribe({
        next: () => {
          this.router.navigate(['/project', this.projectId]);
        },
        error: (err) => {
          console.error('Error creating task:', err);
          // Optionally, display an error message to the user
        }
      });
    }
  }

  /**
   * Retourne le nom d'affichage convivial pour une priorité donnée.
   * @param priority La priorité de la tâche.
   * @returns Le nom d'affichage de la priorité.
   */
  getPriorityDisplayName(priority: string): string {
    return this.priorityDisplayNames[priority] || priority;
  }
}
