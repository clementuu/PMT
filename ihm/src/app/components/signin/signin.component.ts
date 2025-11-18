import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  email = '';
  password = '';
  confirmPassword = '';
  signinError: string | null = null;

  constructor(
    private router: Router
  ) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.signinError = 'Les mots de passe ne correspondent pas.';
      return;
    }
    
    if (this.email && this.password) {
      // TODO: Implement API call for signin
      console.log('Signin attempt with:', this.email, this.password);
      // For now, just navigate to dashboard on successful "signin"
      this.router.navigate(['/dashboard']);
    } else {
      this.signinError = 'Veuillez remplir tous les champs.';
    }
  }
}