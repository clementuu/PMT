import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SigninRequest } from '../../models/requests.model';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  nom = '';
  email = '';
  password = '';
  confirmPassword = '';
  signinError: string | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  onSubmit() {
    this.signinError = null;

    if (this.password !== this.confirmPassword) {
      this.signinError = 'Les mots de passe ne correspondent pas.';
      return;
    }
    
    if (this.nom && this.email && this.password) {
      const signinRequest: SigninRequest = {
        username: this.nom,
        email: this.email,
        mdp: this.password
      };

      this.apiService.postUser(signinRequest).subscribe({
        next: (user) => {
          // Successfully created user, navigate to login page
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.signinError = "Une erreur s'est produite lors de l'inscription.";
          console.error(err);
        }
      });
    } else {
      this.signinError = 'Veuillez remplir tous les champs.';
    }
  }
}