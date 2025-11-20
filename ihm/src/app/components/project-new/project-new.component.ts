import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';
import { switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-new.component.html',
  styleUrl: './project-new.component.css',
})
export class ProjectNewComponent implements OnInit {
  projectForm: FormGroup;
  allUsers: User[] = [];
  availableRoles: string[] = ['ADMIN', 'MEMBER', 'OBSERVER']; // Example roles


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.projectForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dateFin: [''],
      participants: this.fb.array([], Validators.minLength(1)),
    });
  }

  ngOnInit(): void {
    console.log(this.apiService);
    console.log(this.authService);
    this.apiService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users;
        const currentUser = this.authService.user;
        if (currentUser) {
          this.addParticipant(currentUser.id, 'ADMIN');
        } else {
          this.addParticipant();
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  get participants(): FormArray {
    return this.projectForm.get('participants') as FormArray;
  }

  addParticipant(userId: number | string = '', role = 'MEMBER'): void {
    const participantForm = this.fb.group({
      userId: [userId, Validators.required],
      role: [role, Validators.required],
    });
    this.participants.push(participantForm);
  }

  removeParticipant(index: number): void {
    this.participants.removeAt(index);
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const { nom, description, dateFin, participants } =
      this.projectForm.value;

    const newProject: Partial<Project> = {
      nom,
      description,
      dateFin: dateFin || null,
    };

    this.apiService
      .createProject(newProject)
      .pipe(
        switchMap((createdProject) => {
          console.log('Project created successfully:', createdProject);
          if (participants && participants.length > 0) {
            const usersProjectData = {
              projectId: createdProject.id!,
              users: participants.map((p: { userId: any; role: any; }) => ({
                userId: p.userId,
                role: p.role,
              })),
            };
            return this.apiService.postUsersProject(usersProjectData);
          } else {
            return []; // No users to add, complete the stream.
          }
        })
      )
      .subscribe({
        next: () => {
          console.log('Users added to project successfully.');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error during project creation or user assignment:', error);
          alert(
            "Une erreur est survenue : " + (error.details?.error || error.message)
          );
        },
        complete: () => {
          // If the pipe completes without users to add, navigate.
          if (!participants || participants.length === 0) {
            this.router.navigate(['/dashboard']);
          }
        }
      });
  }
}
