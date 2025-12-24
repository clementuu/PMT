import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { error } from 'console';

@Component({
  selector: 'app-task-assign',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-assign.component.html',
  styleUrl: './task-assign.component.css',
})
export class TaskAssignComponent implements OnInit {
  @Input() taskId!: number;
  @Output() taskAssigned = new EventEmitter<void>();

  users: User[] = [];
  selectedUserId: number | undefined;
  assigned: User[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
        // Optionally display an error message to the user
      },
    });
    this.apiService.getAllAssigned(this.taskId).subscribe({
      next: (data) => {
        this.assigned = data;
      },
      error: (err) => {
        console.error("getting assigned", err)
      }
    });
  }

  assignTask(): void {
    if (this.taskId && this.selectedUserId) {
      this.apiService.assignTaskToUser(this.taskId, this.selectedUserId).subscribe({
        next: () => {
          alert('Task assigned successfully!');
          this.taskAssigned.emit();
          this.selectedUserId = undefined; // Reset selection
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
}
