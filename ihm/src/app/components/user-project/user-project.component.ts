import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { UserRole, UsersProject } from '../../models/userProject.model';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-project.component.html',
  styleUrls: ['./user-project.component.css']
})
export class UserProjectComponent implements OnChanges, OnInit {
  @Input() allUsers: User[] = [];
  @Input() availableRoles: string[] = ['ADMIN', 'MEMBER', 'OBSERVER'];
  @Input() projectId: number = 0;
  @Input() currentUserRole: string | null = null;
  @Input() editing: boolean = false;

  addParticipantForm: FormGroup;
  private authService = inject(AuthService);

  roleDisplayNames: { [key: string]: string } = {
    'ADMIN': 'Administrateur',
    'MEMBER': 'Membre',
    'OBSERVER': 'Observateur',
  };

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService
  ) {
    this.addParticipantForm = this.fb.group({
      participants: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // If in creation mode, pre-fill with the current user as ADMIN.
    if (!this.editing) {
      const currentUser = this.authService.user;
      if (currentUser) {
        this.addParticipant({ userId: currentUser.id, role: 'ADMIN' });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If the projectId or editing status changes, fetch the data.
    if (changes['projectId'] || changes['editing']) {
      this.loadParticipants();
    }
  }

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

  get participants(): FormArray {
    return this.addParticipantForm.get('participants') as FormArray;
  }

  addParticipant(participant: Partial<UserRole> | null = null): void {
    const isObserver = this.currentUserRole === 'OBSERVER';

    const participantForm = this.fb.group({
      id: [participant?.id],
      userId: [{ value: participant?.userId || '', disabled: isObserver }, Validators.required],
      role: [{ value: participant?.role || 'MEMBER', disabled: isObserver }, Validators.required]
    });
    this.participants.push(participantForm);
  }

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

  getRoleDisplayName(role: string): string {
    return this.roleDisplayNames[role] || role;
  }
}