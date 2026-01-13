import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';
import { switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserProjectComponent } from '../user-project/user-project.component';
import { UserRole } from '../../models/userProject.model';

/**
 * Composant pour la création d'un nouveau projet.
 * Permet aux utilisateurs de définir les détails du projet et d'ajouter des participants avec des rôles.
 */
@Component({
  selector: 'app-project-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserProjectComponent],
  templateUrl: './project-new.component.html',
  styleUrl: './project-new.component.css',
})
export class ProjectNewComponent implements OnInit {
  /**
   * Formulaire réactif pour la création d'un nouveau projet.
   */
  projectForm: FormGroup;
  /**
   * Liste de tous les utilisateurs disponibles pour être ajoutés au projet.
   */
  allUsers: User[] = [];
  /**
   * Rôles disponibles pour l'assignation aux membres du projet.
   */
  availableRoles: string[] = ['ADMIN', 'MEMBER', 'OBSERVER'];
  
  /**
   * Liste des participants (avec leurs rôles) à sauvegarder avec le projet.
   */
  participantsToSave: UserRole[] = [];
  /**
   * Liste initiale des participants, utilisée pour pré-remplir la liste des participants (ex: l'admin créateur).
   */
  initialParticipantList: UserRole[] = [];

  /**
   * Constructeur du ProjectNewComponent.
   * @param fb Le FormBuilder pour créer le formulaire réactif.
   * @param apiService Le service API pour interagir avec le backend.
   * @param router Le service Router pour la navigation après la création du projet.
   * @param authService Le service d'authentification pour obtenir l'utilisateur courant.
   */
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {
    this.projectForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
    });
  }

  /**
   * Méthode du cycle de vie ngOnInit.
   * Charge tous les utilisateurs et pré-remplit la liste des participants avec l'utilisateur actuel en tant qu'administrateur.
   */
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

  /**
   * Met à jour la liste des participants à sauvegarder.
   * @param participants La nouvelle liste de participants avec leurs rôles.
   */
  setParticipants(participants: UserRole[]): void {
    this.participantsToSave = participants;
  }

  /**
   * Gère la soumission du formulaire de création de projet.
   * Valide le formulaire, crée le projet et assigne les participants.
   * Redirige vers le tableau de bord en cas de succès.
   */
  onSubmit(): void {
    if (this.projectForm.invalid) {
      alert('Veuillez remplir les champs du projet.');
      return;
    }
    if (this.participantsToSave.length === 0) {
      alert('Veuillez ajouter au moins un participant.');
      return;
    }

    console.log(this.projectForm.value);

    const { nom, description, dateFin, dateDebut } = this.projectForm.value;

    const newProject: Partial<Project> = {
      nom,
      description,
      dateDebut: new Date(dateDebut),
      dateFin: dateFin ? new Date(dateFin) : undefined,
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
