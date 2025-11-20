import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { UserRole } from '../../models/userProject.model';

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
  @Output() save = new EventEmitter<any[]>();

  addParticipantForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addParticipantForm = this.fb.group({
      participants: this.fb.array([])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
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
      userId: [participant?.userId || '', Validators.required],
      role: [participant?.role || 'MEMBER', Validators.required]
    });
    this.participants.push(participantForm);
  }

  removeParticipant(index: number): void {
    this.participants.removeAt(index);
  }

  onSubmit(): void {
    if (this.addParticipantForm.valid && this.participants.length > 0) {
      this.save.emit(this.addParticipantForm.value.participants);
      this.participants.clear();
      this.addParticipant(); // Add a fresh row after submitting
    }
  }
}