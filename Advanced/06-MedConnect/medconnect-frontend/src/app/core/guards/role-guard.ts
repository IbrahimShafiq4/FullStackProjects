import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, TRole } from '../services/auth.service';

export const roleGuard = (allowed: TRole[]): CanActivateFn => () => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const user = auth.currentUser();
  if (user && allowed.includes(user.role)) return true;
  router.navigate([user?.role === 'Doctor' ? '/dashboard' : '/book']);
  return false;
};