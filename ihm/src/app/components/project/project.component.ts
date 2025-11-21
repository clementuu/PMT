import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { User } from '../../models/user.model';
import { UserProjectAddComponent } from '../user-project-add/user-project-add.component';
import { UserRole, UsersProject } from '../../models/userProject.model';


@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, UserProjectAddComponent],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  project: Project | null = null;
  projectForm: FormGroup;
  isEditing = false;

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  allUsers: User[] = [];
  allMembers: UserRole[] = [];
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
      this.apiService.getProjectById(+id).subscribe(project => {
        this.project = project;
        this.projectForm.patchValue(project);
        this.todoTasks = project.tasks.filter(t => t.status === 'TODO');
        this.inProgressTasks = project.tasks.filter(t => t.status === 'IN_PROGRESS');
        this.doneTasks = project.tasks.filter(t => t.status === 'DONE');
      });

      this.apiService.getAllUsers().subscribe(users => {
        this.allUsers = users;
      });

      this.apiService.getUsersProject(+id).subscribe(usersProject => {
        this.allMembers = usersProject.users.map(up => ({
          userId: up.userId,
          role: up.role
        }));
      })
    }
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
    if (this.project && this.projectForm.valid) {
      const updatedProject = { ...this.project, ...this.projectForm.value };
      this.apiService.updateProject(updatedProject).subscribe(project => {
        this.project = project;
        this.isEditing = false;
        alert('Projet mis à jour avec succès!');
      });
    }
  }

  onParticipantsSaved(participants: any[]): void {
    if (!this.project) {
      return;
    }

    const payload: UsersProject = {
      projectId: this.project.id,
      users: participants,
    };

    this.apiService.postUsersProject(payload).subscribe({
      next: () => {
        alert('Participants ajoutés avec succès !');
        // Refresh project data to show new participants
        if (this.project?.id) {
            this.apiService.getProjectById(this.project.id).subscribe(project => {
                this.project = project;
            });
        }
      },
      error: (err) => {
        console.error('Error adding participants:', err);
        alert("Erreur lors de l'ajout des participants.");
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
