import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProjectListComponent } from '../project-list/project-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProjectListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private authService: AuthService, private router: Router) {}

  goToNewProject() {
    this.router.navigate(['/new-project']);
  }
}