import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { UserRole, UsersProject } from '../../models/userProject.model';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

/**
 * Composant de gestion des utilisateurs associés à un projet.
 * Permet d'ajouter, de modifier et de supprimer des participants à un projet
 * avec leurs rôles respectifs.
 */
@Component({
  selector: 'app-user-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-project.component.html',
  styleUrls: ['./user-project.component.css']
})
export class UserProjectComponent implements OnChanges, OnInit {
  /**
   * Liste de tous les utilisateurs disponibles pour l'assignation.
   */
  @Input() allUsers: User[] = [];
  /**
   * Rôles disponibles pour les participants du projet.
   */
  @Input() availableRoles: string[] = ['ADMIN', 'MEMBER', 'OBSERVER'];
  /**
   * L'ID du projet dont les participants sont gérés.
   */
  @Input() projectId: number = 0;
  /**
   * Le rôle de l'utilisateur actuel dans le projet.
   */
  @Input() currentUserRole: string | null = null;
  /**
   * Indique si le composant est en mode édition (pour un projet existant).
   */
  @Input() editing: boolean = false;

  /**
   * Formulaire réactif pour ajouter et gérer les participants.
   */
  addParticipantForm: FormGroup;
  private authService = inject(AuthService);

  /**
   * Mapping des noms de rôle pour un affichage convivial.
   */
  roleDisplayNames: { [key: string]: string } = {
    'ADMIN': 'Administrateur',
    'MEMBER': 'Membre',
    'OBSERVER': 'Observateur',
  };

  /**
   * Constructeur du UserProjectComponent.
   * @param fb Le FormBuilder pour créer le formulaire réactif.
   * @param apiService Le service API pour interagir avec le backend.
   */
  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService
  ) {
    this.addParticipantForm = this.fb.group({
      participants: this.fb.array([])
    });
  }

  /**
   * Méthode du cycle de vie ngOnInit.
   * Si le composant n'est pas en mode édition (création de projet),
   * ajoute l'utilisateur actuel comme ADMIN par défaut.
   */
  ngOnInit(): void {
    // If in creation mode, pre-fill with the current user as ADMIN.
    if (!this.editing) {
      const currentUser = this.authService.user;
      if (currentUser) {
        this.addParticipant({ userId: currentUser.id, role: 'ADMIN' });
      }
    }
  }

  /**
   * Gère les changements sur les propriétés d'entrée (projectId, editing).
   * Appelle `loadParticipants` si projectId ou editing change.
   * @param changes Objet SimpleChanges contenant les changements des propriétés.
   */
  ngOnChanges(changes: SimpleChanges): void {
    // If the projectId or editing status changes, fetch the data.
    if (changes['projectId'] || changes['editing']) {
      this.loadParticipants();
    }
  }

  /**
   * Charge les participants du projet depuis le backend et construit le formulaire.
   * Cette méthode est publique pour être appelée depuis le parent.
   */
  public loadParticipants(): void { // Renamed from fetchAndBuildForm and made public
    // Only fetch if we are in 'editing' mode (i.e., the project exists) and have a valid ID.
    if (this.editing && this.projectId > 0) {
      this.apiService.getUsersProject(this.projectId).subscribe(usersProject => {
        this.participants.clear();
        usersProject.users.forEach(p => this.addParticipant(p));
      });
    } else {
      // If not editing (i.e., new project), ensure the form is empty before ngOnInit runs.
      this.participants.clear();
    }
  }

  /**
   * Accesseur pour le FormArray 'participants'.
   */
  get participants(): FormArray {
    return this.addParticipantForm.get('participants') as FormArray;
  }

  /**
   * Ajoute un nouveau participant au formulaire.
   * @param participant Les données du participant à ajouter (userId, role), facultatif.
   */
  addParticipant(participant: Partial<UserRole> | null = null): void {
    const isAdmin = this.currentUserRole === 'ADMIN';

    const participantForm = this.fb.group({
      id: [participant?.id],
      userId: [{ value: participant?.userId || '', disabled: !isAdmin }, Validators.required],
      role: [{ value: participant?.role || 'MEMBER', disabled: !isAdmin }, Validators.required]
    });
    this.participants.push(participantForm);
  }

  /**
   * Supprime un participant du formulaire.
   * Si le participant existe déjà en base de données (possède un ID), il est également supprimé via l'API.
   * @param index L'index du participant à supprimer dans le FormArray.
   */
  removeParticipant(index: number): void {
    const participantControl = this.participants.at(index);
    const userRoleId = participantControl.value.id;

    if (userRoleId) {
      // If participant has an ID, it's saved in the DB. Call API to delete.
      this.apiService.deleteUserProject(userRoleId).subscribe({
        next: () => this.loadParticipants(), // On success, re-fetch the list from the server.
        error: (err) => console.error("Error deleting user from project", err)
      });
    } else {
      // If no ID, it's a new line item. Just remove from the form array.
      this.participants.removeAt(index);
    }
  }

  /**
   * Soumet les modifications des participants au backend.
   * Utilisé pour la création ou la mise à jour des associations utilisateurs-projets.
   */
  onSubmit(): void {
    if (!this.addParticipantForm.valid) {
      return;
    }

    const payload: UsersProject = {
      projectId: this.projectId,
      users: this.addParticipantForm.value.participants,
    };

    this.apiService.postUsersProject(payload).subscribe({
      next: () => {
        this.loadParticipants(); // Re-fetch to ensure UI is in sync.
      },
      error: (err) => {
        console.error('Error saving participants:', err);
        alert("Erreur lors de l'enregistrement des participants.");
      }
    });
  }

  /**
   * Retourne le nom d'affichage convivial pour un rôle donné.
   * @param role Le rôle à afficher.
   * @returns Le nom d'affichage du rôle.
   */
  getRoleDisplayName(role: string): string {
    return this.roleDisplayNames[role] || role;
  }
}