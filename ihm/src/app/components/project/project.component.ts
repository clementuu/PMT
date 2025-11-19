import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  project: Project | null = null;
  projectForm: FormGroup;
  isEditing = false;

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

  get todoTasks(): Task[] {
    return this.project?.tasks.filter(t => t.status === 'TODO') || [];
  }

  get inProgressTasks(): Task[] {
    return this.project?.tasks.filter(t => t.status === 'IN_PROGRESS') || [];
  }

  get doneTasks(): Task[] {
    return this.project?.tasks.filter(t => t.status === 'DONE') || [];
  }
}
