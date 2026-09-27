import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const organizerGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (!auth.currentUser()) {
    router.navigate(['/login']);
    return false;
  }

  if (auth.isOrganizer()) return true;

  router.navigate(['/']);
  return false;
};