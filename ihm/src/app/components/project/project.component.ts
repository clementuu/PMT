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

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id as 'TODO' | 'IN_PROGRESS' | 'DONE';
      task.status = newStatus;

      this.apiService.updateTask(task).subscribe(() => {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }, (error) => {
        // Revert status on error
        task.status = event.previousContainer.id as 'TODO' | 'IN_PROGRESS' | 'DONE';
        alert("Erreur lors de la mise à jour de la tâche.");
      });
    }
  }
}
