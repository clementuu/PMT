import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { User } from '../../models/user.model';
import { UserProjectComponent } from '../user-project/user-project.component';
import { HistoriqueComponent } from "../historique/historique.component";
import { AuthService } from '../../services/auth.service';
import { ProjectUpdatePayload } from '../../models/project-update.model';

/**
 * Composant de gestion des projets individuels.
 * Affiche les détails d'un projet, permet son édition, la gestion des tâches
 * par glisser-déposer (Drag and Drop), et l'affichage de l'historique et des participants.
 */
@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, UserProjectComponent, HistoriqueComponent],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, AfterViewInit {
  /**
   * Référence au composant Historique enfant.
   */
  @ViewChild(HistoriqueComponent) historiqueComponent!: HistoriqueComponent;
  /**
   * Référence au composant UserProject enfant.
   */
  @ViewChild(UserProjectComponent) userProjectComponent!: UserProjectComponent;

  /**
   * Le projet actuellement affiché.
   */
  project: Project | null = null;
  /**
   * Formulaire réactif pour l'édition des détails du projet.
   */
  projectForm: FormGroup;
  /**
   * Indique si le mode édition du projet est activé.
   */
  isEditing = false;
  /**
   * Rôle de l'utilisateur actuel dans le projet.
   */
  currentUserRole: string | null = null;

  private authService = inject(AuthService);

  /**
   * Liste des tâches avec le statut 'À FAIRE'.
   */
  todoTasks: Task[] = [];
  /**
   * Liste des tâches avec le statut 'EN COURS'.
   */
  inProgressTasks: Task[] = [];
  /**
   * Liste des tâches avec le statut 'TERMINÉ'.
   */
  doneTasks: Task[] = [];

  /**
   * Liste de tous les utilisateurs disponibles.
   */
  allUsers: User[] = [];
  /**
   * Rôles disponibles pour l'assignation aux membres du projet.
   */
  availableRoles: string[] = ['ADMIN', 'MEMBER', 'OBSERVER'];


  /**
   * Constructeur du ProjectComponent.
   * @param route Le service ActivatedRoute pour accéder aux paramètres de l'URL.
   * @param apiService Le service API pour interagir avec le backend.
   * @param fb Le FormBuilder pour créer le formulaire réactif.
   * @param router Le service Router pour la navigation.
   */
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.projectForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dateFin: ['']
    });
  }

  /**
   * Méthode du cycle de vie ngOnInit.
   * Charge les données du projet lorsque le composant est initialisé.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProjectData(+id);
    }
  }

  /**
   * Méthode du cycle de vie ngAfterViewInit.
   * Assure que les composants enfants sont initialisés avant d'appeler leurs méthodes.
   */
  ngAfterViewInit(): void {
    if (this.project?.id) {
      this.historiqueComponent.loadHistory();
      this.userProjectComponent.loadParticipants();
    }
  }

  /**
   * Charge toutes les données relatives à un projet spécifique.
   * @param id L'ID du projet à charger.
   */
  private loadProjectData(id: number): void {
    this.apiService.getProjectById(id).subscribe(project => {
      this.project = project;
      this.projectForm.patchValue(project);
      this.todoTasks = project.tasks.filter(t => t.status === 'TODO');
      this.inProgressTasks = project.tasks.filter(t => t.status === 'IN_PROGRESS');
      this.doneTasks = project.tasks.filter(t => t.status === 'DONE');

      this.apiService.getAllUsers().subscribe(users => {
        this.allUsers = users;
      });

      // Fetch current user's role for this project
      if (this.authService.user && this.project.id) {
        this.apiService.getUsersProject(this.project.id).subscribe(usersProject => {
          const userRole = usersProject.users.find(up => up.userId === this.authService.user?.id);
          this.currentUserRole = userRole ? userRole.role : null;
        });
      }

      // Explicitly reload child components after main project data is loaded
      if (this.historiqueComponent) {
        this.historiqueComponent.loadHistory();
      }
      if (this.userProjectComponent) {
        this.userProjectComponent.loadParticipants();
      }
    });
  }

  /**
   * Active le mode édition du projet.
   */
  startEditing(): void {
    this.isEditing = true;
    this.projectForm.patchValue(this.project as any);
  }

  /**
   * Annule le mode édition du projet.
   */
  cancelEdit(): void {
    this.isEditing = false;
  }

  /**
   * Met à jour les informations du projet.
   * Envoie les données modifiées au backend via l'ApiService.
   */
  updateProject(): void {
    if (!this.authService.user) {
      alert("Vous devez être connecté pour mettre à jour un projet.");
      return;
    }
  
    if (!this.project || !this.projectForm.valid) {
      alert("Le formulaire est invalide.");
      return;
    }
  
    const updatedProjectData = {
      ...this.project,
      ...this.projectForm.value
    };

    console.log(this.authService.user.id);
  
    const payload: ProjectUpdatePayload = {
      project: updatedProjectData,
      userId: this.authService.user.id
    };
  
    this.apiService.updateProject(payload).subscribe({
      next: (project) => {
        this.isEditing = false;
        this.loadProjectData(project.id); // Reload all data after successful update
      },
      error: (err) => {
        console.error('Error updating project:', err);
        alert("Erreur lors de la mise à jour du projet !");
      }
    });
  }

  /**
   * Supprime le projet actuel.
   * Demande une confirmation avant de procéder à la suppression.
   */
  deleteProject() {
    if (this.project == null ) {
      return;
    }
    var ok = confirm("Voulez vous supprimer ce projet ?");
    if (ok) {
      this.apiService.deleteProject(this.project.id).subscribe({
        next: () => {
          alert("Projet supprimé !");
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error removing project:', err);
          alert("Erreur lors de la suppression du projet.");
        }
      })
    }
  }

  /**
   * Navigue vers la page de détail d'une tâche.
   * @param taskId L'ID de la tâche à afficher.
   */
  goToTaskDetail(taskId: number): void {
    this.router.navigate(['/task', taskId]);
  }

  /**
   * Navigue vers la page de création d'une nouvelle tâche pour le projet actuel.
   */
  goToNewTask(): void {
    if (this.project == null) {
      return;
    }
    this.router.navigate([`/project/${this.project.id}/new-task`]);
  }

  /**
   * Gère l'événement de glisser-déposer (Drag and Drop) des tâches.
   * Met à jour le statut d'une tâche et sa position dans les listes.
   * @param event L'événement CdkDragDrop.
   */
  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id as 'TODO' | 'IN_PROGRESS' | 'DONE';
      const originalStatus = task.status;
      task.status = newStatus;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const taskToSend = { ...task, projectId: this.project!.id, userId: this.authService.user?.id }; // Use projectId instead of project object

      this.apiService.updateTask(taskToSend).subscribe({
        next: () => {},
        error: (error) => {
          console.error("Erreur lors de la mise à jour de la tâche :", error);
          alert("Erreur lors de la mise à jour de la tâche.");
          task.status = originalStatus;
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex,
          );
        }
      });
    }
  }
}
