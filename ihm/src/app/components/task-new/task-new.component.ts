import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-new',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './task-new.component.html',
  styleUrls: ['./task-new.component.css']
})
export class TaskNewComponent implements OnInit {
  taskForm: FormGroup;
  projectId!: number;
  priorities: Task['priorite'][] = ['LOW', 'MEDIUM', 'HIGH'];

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

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData: Partial<Task> = {
        ...this.taskForm.value,
        project: { id: this.projectId },
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
}
