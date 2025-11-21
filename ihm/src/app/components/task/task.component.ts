import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Task } from '../../models/task.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  task: Task | null = null;
  isEditing = false;
  taskForm: FormGroup;

  // Enum-like objects for dropdowns
  priorities: Task['priorite'][] = ['LOW', 'MEDIUM', 'HIGH'];
  statuses: Task['status'][] = ['TODO', 'IN_PROGRESS', 'DONE'];

  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  constructor() {
    this.taskForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dateEcheance: ['', Validators.required],
      priorite: ['MEDIUM', Validators.required],
      status: ['TODO', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.apiService.getTask(parseInt(id, 10)).subscribe({
          next: (task: Task) => {
            this.task = task;
          },
          error: (error) => console.error('Error fetching task details:', error)
        });
      }
    });
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
      error: (err) => console.error('Error updating task:', err)
    });
  }
}
