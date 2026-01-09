import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Assigned, User } from '../../models/user.model';

@Component({
  selector: 'app-task-assign',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-assign.component.html',
  styleUrl: './task-assign.component.css',
})
export class TaskAssignComponent implements OnInit {
  @Input() taskId!: number;
  @Input() projectId!: number;
  @Output() taskAssigned = new EventEmitter<void>();

  users: User[] = [];
  selectedUserId: number | undefined;
  assigned: Assigned[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProjectUsers();
    this.loadAssignedUsers();
  }

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
