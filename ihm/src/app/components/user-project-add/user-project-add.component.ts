import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { UserRole } from '../../models/userProject.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user-project-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-project-add.component.html',
  styleUrls: ['./user-project-add.component.css']
})
export class UserProjectAddComponent implements OnChanges {
  @Input() allUsers: User[] = [];
  @Input() availableRoles: string[] = ['ADMIN', 'MEMBER', 'OBSERVER'];
  @Input() initialData: UserRole[] = [];
  @Input() projectId: number = 0;
  @Input() editing: boolean = false;
  @Output() save = new EventEmitter<any[]>();

  addParticipantForm: FormGroup;

  roleDisplayNames: { [key: string]: string } = {
    'ADMIN': 'Administrateur',
    'MEMBER': 'Membre',
    'OBSERVER': 'Observateur',
  };

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.addParticipantForm = this.fb.group({
      participants: this.fb.array([])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editing']) {
      this.editing = changes['editing'].currentValue;
    }
    if (changes['initialData'] && this.initialData && this.initialData.length > 0) {
      this.participants.clear();
      this.initialData.forEach(p => this.addParticipant(p));
    }
  }

  get participants(): FormArray {
    return this.addParticipantForm.get('participants') as FormArray;
  }

  addParticipant(participant: UserRole | null = null): void {
    const participantForm = this.fb.group({
      id: [participant?.id],
      userId: [participant?.userId || '', Validators.required],
      role: [participant?.role || 'MEMBER', Validators.required]
    });
    this.participants.push(participantForm);
  }

  removeParticipant(index: number): void {
    const userId = this.allUsers[index].id;
    this.apiService.deleteUserProject(this.projectId, userId)
      .subscribe({
        next: () => {
          this.participants.removeAt(index);
        },
        error: (err) => console.error("Error deleting user from project", err)
      });
  }

  onSubmit(): void {
    if (this.addParticipantForm.valid && this.participants.length > 0) {
      console.log(this.participants);
      console.log(this.addParticipantForm.value.participants);
      this.save.emit(this.addParticipantForm.value.participants);
    }
  }

  // Method to get the display name for a role
  getRoleDisplayName(role: string): string {
    return this.roleDisplayNames[role] || role;
  }
}