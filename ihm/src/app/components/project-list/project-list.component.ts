import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project.model';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  projects$!: Observable<Project[]>;

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.user;
    if (user) {
      this.projects$ = this.apiService.getProjectsByUserId(user.id);
    }
  }
}
