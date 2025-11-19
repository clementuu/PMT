import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
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
    }
  }

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

  goToTaskDetail(taskId: number): void {
    this.router.navigate(['/task', taskId]);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Get the task and its new status
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id as 'TODO' | 'IN_PROGRESS' | 'DONE';

      // Store original status for potential revert
      const originalStatus = task.status;
      task.status = newStatus; // Update task object locally

      // Optimistic UI update
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // Create a copy to ensure project ID is sent correctly to the backend
      const taskToSend = {
        ...task,
        project: this.project! // Ensure project ID is sent
      };

      this.apiService.updateTask(taskToSend).subscribe({
        next: () => {
          // Success: UI is already updated optimistically
        },
        error: (error) => {
          // Revert UI and status on error
          console.error("Erreur lors de la mise à jour de la tâche :", error);
          alert("Erreur lors de la mise à jour de la tâche.");

          // Revert transferArrayItem
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex,
          );
          task.status = originalStatus;
        }
      });
    }
  }
}
