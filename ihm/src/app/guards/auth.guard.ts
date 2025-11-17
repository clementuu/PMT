import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si l'utilisateur est connecté, autorise l'accès à la route
  if (authService.isLoggedIn) {
    return true;
  }

  // Sinon, redirige l'utilisateur vers la page de connexion
  router.navigate(['/login']);
  return false;
};