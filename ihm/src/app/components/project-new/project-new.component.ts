import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';
import { switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserProjectAddComponent } from '../user-project-add/user-project-add.component';
import { UserRole } from '../../models/userProject.model';

@Component({
  selector: 'app-project-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserProjectAddComponent],
  templateUrl: './project-new.component.html',
  styleUrl: './project-new.component.css',
})
export class ProjectNewComponent implements OnInit {
  projectForm: FormGroup;
  allUsers: User[] = [];
  availableRoles: string[] = ['ADMIN', 'MEMBER', 'OBSERVER'];
  
  participantsToSave: UserRole[] = [];
  initialParticipantList: UserRole[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {
    this.projectForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dateFin: [''],
    });
  }

  ngOnInit(): void {
    this.apiService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        const currentUser = this.authService.user;
        if (currentUser) {
          this.initialParticipantList = [{ id: NaN, userId: currentUser.id, role: 'ADMIN' }];
          this.participantsToSave = this.initialParticipantList;
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  setParticipants(participants: UserRole[]): void {
    this.participantsToSave = participants;
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      alert('Veuillez remplir les champs du projet.');
      return;
    }
    if (this.participantsToSave.length === 0) {
      alert('Veuillez ajouter au moins un participant.');
      return;
    }

    const { nom, description, dateFin } = this.projectForm.value;

    const newProject: Partial<Project> = {
      nom,
      description,
      dateFin: dateFin || null,
    };

    this.apiService
      .createProject(newProject)
      .pipe(
        switchMap((createdProject) => {
          const usersProjectData = {
            projectId: createdProject.id!,
            users: this.participantsToSave,
          };
          return this.apiService.postUsersProject(usersProjectData);
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error during project creation or user assignment:', error);
          alert("Une erreur est survenue : " + (error.details?.error || error.message));
        },
      });
  }
}
