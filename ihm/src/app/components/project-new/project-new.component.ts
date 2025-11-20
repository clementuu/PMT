import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-new.component.html',
  styleUrl: './project-new.component.css',
})
export class ProjectNewComponent implements OnInit {
  projectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.projectForm = this.fb.group({}); // Initialize here to avoid TS error
  }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const newProject: Partial<Project> = {
        nom: this.projectForm.value.nom,
        description: this.projectForm.value.description,
        dateFin: this.projectForm.value.dateFin || null, // Handle optional dateFin
      };

      this.apiService.createProject(newProject).subscribe({
        next: (project) => {
          console.log('Project created successfully:', project);
          this.router.navigate(['/projects']); // Navigate to project list or dashboard
        },
        error: (error) => {
          console.error('Error creating project:', error);
          alert("Erreur lors de la création du projet : " + (error.details?.error || error.message));
        }
      });
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }
}
