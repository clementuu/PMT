import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.email && this.password) {
      console.log('Tentative de connexion avec :', { email: this.email, password: '***' });
      // Ici, vous appelleriez normalement un service d'authentification.
      // Pour la démo, nous allons simplement rediriger vers une page "dashboard".
      // this.router.navigate(['/dashboard']);
    }
  }
}