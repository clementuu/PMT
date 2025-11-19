import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { ActivatedRoute, RouterModule } from '@angular/router'; // <-- RouterModule
import { ApiService } from '../../services/api.service'; // <-- ApiService

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, RouterModule], // <-- ajoute RouterModule
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  task: Task | null = null;

  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  constructor() {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.apiService.getTask(parseInt(id, 10)).subscribe({
          next: (task: Task) => this.task = task,
          error: (error) => console.error('Error fetching task details:', error)
        });
      }
    });
  }
}
