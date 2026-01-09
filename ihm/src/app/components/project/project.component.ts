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


@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, UserProjectComponent, HistoriqueComponent],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, AfterViewInit { // Add AfterViewInit
  @ViewChild(HistoriqueComponent) historiqueComponent!: HistoriqueComponent;
  @ViewChild(UserProjectComponent) userProjectComponent!: UserProjectComponent;

  project: Project | null = null;
  projectForm: FormGroup;
  isEditing = false;

  private authService = inject(AuthService);

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  allUsers: User[] = [];
  availableRoles: string[] = ['ADMIN', 'MEMBER', 'OBSERVER'];


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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProjectData(+id); // Call loadProjectData
    }
  }

  ngAfterViewInit(): void {
    // Ensure child components are initialized before calling their methods
    // This is mainly for initial load, subsequent reloads are handled by loadProjectData
    if (this.project?.id) {
      this.historiqueComponent.loadHistory();
      this.userProjectComponent.loadParticipants();
    }
  }

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

      // Explicitly reload child components after main project data is loaded
      if (this.historiqueComponent) {
        this.historiqueComponent.loadHistory();
      }
      if (this.userProjectComponent) {
        this.userProjectComponent.loadParticipants();
      }
    });
  }

  // ===== Project Editing Methods =====
  startEditing(): void {
    this.isEditing = true;
    this.projectForm.patchValue(this.project as any);
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

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
        alert('Projet mis à jour avec succès!');
        this.isEditing = false;
        this.loadProjectData(project.id); // Reload all data after successful update
      },
      error: (err) => {
        console.error('Error updating project:', err);
        alert("Erreur lors de la mise à jour du projet !");
      }
    });
  }


  deleteProject() {
    if (this.project == null ) {
      return;
    }
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

  goToTaskDetail(taskId: number): void {
    this.router.navigate(['/task', taskId]);
  }

  goToNewTask(): void {
    if (this.project == null) {
      return;
    }
    this.router.navigate([`/project/${this.project.id}/new-task`]);
  }

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

      const taskToSend = { ...task, projectId: this.project!.id }; // Use projectId instead of project object

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
